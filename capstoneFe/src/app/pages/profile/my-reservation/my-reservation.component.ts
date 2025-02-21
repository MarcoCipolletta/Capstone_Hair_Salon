import { Component, inject, Input } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationResponseForCustomer } from '../../../interfaces/reservation/i-reservation-response-for-customer';

@Component({
  selector: 'app-my-reservation',
  templateUrl: './my-reservation.component.html',
  styleUrl: './my-reservation.component.scss',
})
export class MyReservationComponent {
  constructor(private reservationSvc: ReservationsService) {}

  myReservations: iReservationResponseForCustomer[] = [];

  ngOnInit(): void {
    this.reservationSvc.getAllByLoggedUser().subscribe({
      next: (res) => {
        this.myReservations = res;
        console.log(this.myReservations);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
