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
        this.userAuthSubject$.next(dati);
        this.$isLogged.next(true);

        this.decodeToken.userRoles$.next(this.decodeToken.getRoles());
        localStorage.setItem('accessData', JSON.stringify(dati));

        //recupero la data di scadenza del token
        const date = this.jwtHelper.getTokenExpirationDate(dati.token);
        if (date) this.autoLogout(date);
      })
    );
  }

  logout() {
    this.userAuthSubject$.next(null);
    this.decodeToken.userRoles$.next([]);
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
    this.decodeToken.userRoles$.next(this.decodeToken.getRoles());
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

  update(appUser: iAuthUserResponse) {
    return this.http.put<iAuthUserResponse>(this.baseUrl + '/update', appUser);
  }

  changePassword(changePasswordRequest: iChangePasswordRequest) {
    return this.http.patch(
      this.baseUrl + 'change-password',
      changePasswordRequest
    );
  }
}
