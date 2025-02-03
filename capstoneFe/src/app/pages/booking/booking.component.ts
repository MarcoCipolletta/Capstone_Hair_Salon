import { Component, HostListener, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from '../../services/reservations.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  private authSvc = inject(AuthSvc);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private reservationSvc = inject(ReservationsService);
  private location = inject(Location);
  page: number = 1;
  isLogged: boolean = false;

  ngOnInit() {
    // history.pushState({ page: this.page }, '', location.href);
    this.authSvc.$isLogged.subscribe({
      next: (res) => {
        this.isLogged = res;

        if (this.isLogged && sessionStorage.getItem('newReservation')) {
          this.route.queryParams.subscribe((params) => {
            this.page = +params['page'] || 1;
          });
        }
      },
    });
  }

  onPageChange(page: number) {
    if (page === 3 && !this.isLogged) {
      page = 4;
    }
    this.page = page;
    this.location.go('/booking', 'page=' + this.page);
    // history.pushState({ page: this.page }, '', location.href);
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: PopStateEvent) {
  //   if (this.page > 1) {
  //     this.page--;
  //     history.pushState({ page: this.page }, '', location.href);
  //   }
  // }

  previousPage() {
    if (this.page === 1) {
      return;
    }
    this.page--;
    this.location.go('/booking', 'page=' + this.page);
    // history.pushState({ page: this.page }, '', location.href);
  }

  goToLogin() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/booking?page=3' },
    });
  }
}
