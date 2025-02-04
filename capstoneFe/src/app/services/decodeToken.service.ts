import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DecodeTokenService {
  constructor() {
    this.userRole$.next(this.getRole());
  }

  jwtHelper: JwtHelperService = new JwtHelperService();

  userRole$ = new BehaviorSubject<string>('');

  getRole() {
    const json = localStorage.getItem('accessData');
    if (!json) return;
    const { token } = JSON.parse(json);
    if (!token) return;
    return this.jwtHelper.decodeToken(token).role;
  }
}
