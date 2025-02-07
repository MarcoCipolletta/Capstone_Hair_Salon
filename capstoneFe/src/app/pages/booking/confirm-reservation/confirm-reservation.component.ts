import { Component, inject } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSvc } from '../../../auth/auth.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';

@Component({
  selector: 'app-confirm-reservation',
  templateUrl: './confirm-reservation.component.html',
  styleUrl: './confirm-reservation.component.scss',
})
export class ConfirmReservationComponent {
  private reservationSvc = inject(ReservationsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authSvc = inject(AuthSvc);
  protected timeConversionSvc = inject(TimeConversionSvcService);

  reservation!: iReservationCreateRequest;

  ngOnInit(): void {
    if (
      this.authSvc.isLogged$.getValue() &&
      sessionStorage.getItem('newReservation')
    ) {
      this.reservation = JSON.parse(sessionStorage.getItem('newReservation')!);
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: 1 },
      });
    }
  }

  removeService(index: number) {
    this.reservation.salonServices.splice(index, 1);
    sessionStorage.setItem('newReservation', JSON.stringify(this.reservation));
    sessionStorage.setItem(
      'selectedServices',
      JSON.stringify(this.reservation.salonServices)
    );
  }

  sendReservation() {
    this.reservationSvc.makeReservation(this.reservation).subscribe({
      next: (res) => {
        sessionStorage.removeItem('newReservation');
        sessionStorage.removeItem('selectedServices');

        console.log(res);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  get totalPrice() {
    return this.reservation.salonServices.reduce(
      (acc, service) => acc + service.price,
      0
    );
  }
}
