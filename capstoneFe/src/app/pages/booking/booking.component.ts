import { Component, HostListener, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationsService } from '../../services/reservations.service';
import { iReservationCreateRequest } from '../../interfaces/reservation/i-reservation-create-request';

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
  page: number = 1;
  isLogged: boolean = false;

  ngOnInit() {
    history.pushState({ page: this.page }, '', location.href);
    this.authSvc.$isLogged.subscribe({
      next: (res) => {
        this.isLogged = res;

        if (this.isLogged && sessionStorage.getItem('newReservation')) {
          console.log(
            'new reservation',
            this.reservationSvc.$newReservation.value
          );

          this.route.queryParams.subscribe((params) => {
            this.page = +params['page'] || 1; // Converte il parametro in numero (default: 1)
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
    history.pushState({ page: this.page }, '', location.href);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    if (this.page > 1) {
      this.page--;
      history.pushState({ page: this.page }, '', location.href);
    }
  }

  previousPage() {
    if (this.page === 1) {
      return;
    }
    this.page--;
    history.pushState({ page: this.page }, '', location.href);
  }

  goToLogin() {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/booking?page=3' },
    });
  }
}
