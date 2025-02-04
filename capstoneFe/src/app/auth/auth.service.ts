import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';
import { iAccess } from './interfaces/i-access';
import { DecodeTokenService } from '../services/decodeToken.service';
import { iRegisterRequest } from './interfaces/i-register-request';
import { iLoginRequest } from './interfaces/i-login-request';
import { iPasswordResetRequest } from './interfaces/i-password-reset-request';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';
import { iAuthUserResponse } from './interfaces/i-auth-user-response';
import { iChangePasswordRequest } from './interfaces/i-change-password-request';
import { iAuthUpdateResponse } from './interfaces/i-auth-update-response';

@Injectable({
  providedIn: 'root',
})
export class AuthSvc {
  constructor(
    private http: HttpClient,
    private router: Router,
    private decodeToken: DecodeTokenService
  ) {
    this.restoreUser();
  }
  private jwtHelper: JwtHelperService = new JwtHelperService();

  userAuthSubject$ = new BehaviorSubject<iAccess | null>(null);

  baseUrl: string = environment.baseUrl + '/auth';
  $isLogged = new BehaviorSubject<boolean>(false);
  autoLogoutTimer: any;

  register(user: iRegisterRequest) {
    return this.http.post<iResponseStringMessage>(
      this.baseUrl + '/register',
      user
    );
  }

  login(userDates: iLoginRequest) {
    // qui uso una post per proteggere i dati sensibili e creare un token lato server
    return this.http.post<iAccess>(this.baseUrl + '/login', userDates).pipe(
      tap((dati) => {
        setTimeout(() => {
          console.log('Dati login', dati);

          this.userAuthSubject$.next(dati);
          this.$isLogged.next(true);

          localStorage.setItem('accessData', JSON.stringify(dati));
          this.decodeToken.userRole$.next(this.decodeToken.getRole());

          //recupero la data di scadenza del token
          const date = this.jwtHelper.getTokenExpirationDate(dati.token);
          if (date) this.autoLogout(date);
        }, 1000);
      })
    );
  }

  update(appUser: iAuthUserResponse) {
    return this.http
      .put<iAuthUpdateResponse>(this.baseUrl + '/update', appUser)
      .pipe(
        tap((data) => {
          console.log(data);

          this.userAuthSubject$.next(data.authResponse);
          this.decodeToken.userRole$.next(this.decodeToken.getRole());
          localStorage.setItem('accessData', JSON.stringify(data.authResponse));

          const date = this.jwtHelper.getTokenExpirationDate(
            data.authResponse.token
          );
          if (date) this.autoLogout(date);
        })
      );
  }

  logout() {
    this.userAuthSubject$.next(null);
    this.decodeToken.userRole$.next('');
    this.$isLogged.next(false);

    localStorage.removeItem('accessData');
    this.router.navigate(['/auth']);
  }

  autoLogout(expDate: Date) {
    // calcolo quanto tempo manca tra la data di exp e il momento attuale
    const expMs = expDate.getTime() - new Date().getTime();

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessdata: iAccess = JSON.parse(userJson);

    if (this.jwtHelper.isTokenExpired(accessdata.token)) {
      localStorage.removeItem('accessData');
      return;
    }

    this.userAuthSubject$.next(accessdata);
    this.$isLogged.next(true);
    this.decodeToken.userRole$.next(this.decodeToken.getRole());
  }

  resetPassword(passwordResetRequest: iPasswordResetRequest) {
    return this.http.patch<iResponseStringMessage>(
      this.baseUrl + 'reset-password',
      passwordResetRequest
    );
  }

  sendRequestPasswordReset(email: { email: string }) {
    return this.http.post<iResponseStringMessage>(
      this.baseUrl + '/requestForgotPassword',
      email
    );
  }

  getMe() {
    return this.http.get<iAuthUserResponse>(this.baseUrl + '/me');
  }

  changePassword(changePasswordRequest: iChangePasswordRequest) {
    return this.http.patch(
      this.baseUrl + '/change-password',
      changePasswordRequest
    );
  }
}
