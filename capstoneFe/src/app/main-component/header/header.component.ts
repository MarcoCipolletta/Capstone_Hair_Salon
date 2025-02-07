import { Component, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authSvc = inject(AuthSvc);

  isLogged: boolean = false;
  role: string = '';

  ngOnInit() {
    combineLatest([this.authSvc.isLogged$, this.authSvc.userRole$]).subscribe(
      ([isLogged, role]) => {
        if (isLogged) {
          this.isLogged = isLogged;
          this.role = role;
        } else {
          this.isLogged = isLogged;
          this.role = role;
        }
      }
    );
  }
  logout() {
    this.authSvc.logout();
  }
}
