import { Component, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { combineLatest } from 'rxjs';
import { DecodeTokenService } from '../../services/decodeToken.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authSvc = inject(AuthSvc);
  private decodeToken = inject(DecodeTokenService);

  isLogged: boolean = false;
  role: string = '';

  ngOnInit() {
    combineLatest([
      this.authSvc.$isLogged,
      this.decodeToken.userRole$,
    ]).subscribe(([isLogged, role]) => {
      this.isLogged = isLogged;
      this.role = role;
    });
    this.authSvc.$isLogged.subscribe((res) => {
      this.isLogged = res;
    });
  }
  logout() {
    this.authSvc.logout();
  }
}
