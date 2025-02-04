import { Component, inject, Input } from '@angular/core';
import { iReservationResponseForCustomer } from '../../../interfaces/reservation/i-reservation-response-for-customer';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { ReservationsService } from '../../../services/reservations.service';
import { DecodeTokenService } from '../../../services/decodeToken.service';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
})
export class ReservationCardComponent {
  protected timeConversionsSvc = inject(TimeConversionSvcService);
  private reservationSvc = inject(ReservationsService);
  private decodeTokenSvc = inject(DecodeTokenService);

  userRole!: string;

  @Input() reservation!: iReservationResponseForCustomer;

  ngOnInit() {
    this.decodeTokenSvc.userRole$.subscribe((res) => {
      this.userRole = res;
    });
  }

  get status() {
    switch (this.reservation.status) {
      case 'PENDING':
        return 'In attesa';
      case 'CONFIRMED':
        return 'Confermata';
      case 'CANCELLED':
        return 'Annullata';
      case 'COMPLETED':
        return 'Completata';
      default:
        return '';
    }
  }

  get totalDuration() {
    let totalTime = this.reservation.salonServices.reduce(
      (acc, service) => acc + service.duration,
      0
    );
    return this.timeConversionsSvc.secondsToDuration(totalTime);
  }

  cancelReservation() {
    if (this.userRole === 'USER') {
      this.reservationSvc
        .cancelReservationByUser(this.reservation.id)
        .subscribe({
          next: (res) => {
            this.reservation = res;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
}
