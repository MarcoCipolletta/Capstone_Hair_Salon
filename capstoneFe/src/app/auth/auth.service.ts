import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { iAccess } from './interfaces/i-access';
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
    private router: Router // private decodeToken: DecodeTokenService
  ) {
    this.userAuthSubject$.subscribe((res) => {
      if (res?.user) {
        this.isLogged$.next(true);
        this.userRole$.next(res.user.role);
      } else {
        this.isLogged$.next(false);
        this.userRole$.next('');
      }
    });
  }

  private jwtHelper: JwtHelperService = new JwtHelperService();

  baseUrl: string = environment.baseUrl + '/auth';

  userAuthSubject$ = new BehaviorSubject<iAccess | null>(null);
  isLogged$ = new BehaviorSubject<boolean>(false);
  userRole$ = new BehaviorSubject<string>('');

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
      tap((data) => {
        setTimeout(() => {
          this.userAuthSubject$.next(data);

          localStorage.setItem('accessData', JSON.stringify(data.token));
          // this.decodeToken.userRole$.next(this.decodeToken.getRole());

          //recupero la data di scadenza del token
          const date = this.jwtHelper.getTokenExpirationDate(data.token);
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
          this.userAuthSubject$.next(data.authResponse);
          // this.decodeToken.userRole$.next(this.decodeToken.getRole());
          localStorage.setItem(
            'accessData',
            JSON.stringify(data.authResponse.token)
          );

          const date = this.jwtHelper.getTokenExpirationDate(
            data.authResponse.token
          );
          if (date) this.autoLogout(date);
        })
      );
  }

  logout() {
    this.userAuthSubject$.next(null);

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

    const accessdata: string = JSON.parse(userJson);

    return this.http
      .get<iAccess>(this.baseUrl + '/restoreUser/' + accessdata)
      .pipe(
        tap((res) => {
          this.userAuthSubject$.next(res);
          this.isLogged$.next(true);
          const date = this.jwtHelper.getTokenExpirationDate(res.token);
          if (date) this.autoLogout(date);
        }),
        catchError((err) => {
          this.logout();
          return of();
        })
      );
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
