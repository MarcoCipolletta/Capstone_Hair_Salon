import { Component, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authSvc = inject(AuthSvc);
  logout() {
    this.authSvc.logout();
  }
}
