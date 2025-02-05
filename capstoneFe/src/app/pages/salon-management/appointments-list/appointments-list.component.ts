import { Component } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationResponse } from '../../../interfaces/reservation/i-reservation-response';
import { combineLatest } from 'rxjs';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.scss',
})
export class AppointmentsListComponent {
  confirmedReservation: iReservationResponse[] = [];
  pendingReservation: iReservationResponse[] = [];
  constructor(
    private reservationSvc: ReservationsService,
    protected timeConverterSvc: TimeConversionSvcService
  ) {
    combineLatest([
      this.reservationSvc.$confirmedReservations,
      this.reservationSvc.$pendingReservations,
    ]).subscribe({
      next: ([confirmedReservations, pendingReservations]) => {
        this.confirmedReservation = confirmedReservations;
        this.pendingReservation = pendingReservations;
        console.log(this.confirmedReservation);
        console.log(this.pendingReservation);
      },
    });
  }
}
