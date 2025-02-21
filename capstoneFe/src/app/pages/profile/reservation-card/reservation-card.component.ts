import { Component, inject, Input } from '@angular/core';
import { iReservationResponseForCustomer } from '../../../interfaces/reservation/i-reservation-response-for-customer';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { ReservationsService } from '../../../services/reservations.service';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss',
})
export class ReservationCardComponent {
  constructor(
    protected timeConversionsSvc: TimeConversionSvcService,
    private reservationSvc: ReservationsService
  ) {}

  @Input() reservation!: iReservationResponseForCustomer;

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
    this.reservationSvc.cancelReservationByUser(this.reservation.id).subscribe({
      next: (res) => {
        this.reservation = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
