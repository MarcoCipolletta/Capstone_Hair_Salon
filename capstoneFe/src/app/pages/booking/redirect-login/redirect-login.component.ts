import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSvc } from '../../../auth/auth.service';

@Component({
  selector: 'app-redirect-login',
  templateUrl: './redirect-login.component.html',
  styleUrl: './redirect-login.component.scss',
})
export class RedirectLoginComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthSvc
  ) {}

  isLogged: boolean = false;

  ngOnInit(): void {
    if (!sessionStorage.getItem('newReservation')) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: 1 },
      });
    }
    this.isLogged = this.authSvc.isLogged$.getValue();
    if (this.isLogged) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: 3 },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/booking?page=3' },
    });
  }
}
