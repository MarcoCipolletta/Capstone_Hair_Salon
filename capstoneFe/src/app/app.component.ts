import { Component, inject } from '@angular/core';
import { AuthSvc } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'capstone';
  isLoading = true;

  constructor(private authSvc: AuthSvc) {
    if (!localStorage.getItem('accessData')) {
      this.isLoading = false;
    }
    this.authSvc.restoreUser()?.subscribe((res) => {
      this.isLoading = false;
    });
  }
}
