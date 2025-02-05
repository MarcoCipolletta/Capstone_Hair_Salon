import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iReservationCreateRequest } from '../interfaces/reservation/i-reservation-create-request';
import { environment } from '../../environments/environment.development';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';
import { iReservationResponse } from '../interfaces/reservation/i-reservation-response';
import { BehaviorSubject, tap } from 'rxjs';
import { iReservationResponseForCustomer } from '../interfaces/reservation/i-reservation-response-for-customer';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  $newReservation = new BehaviorSubject<iReservationCreateRequest | null>(null);
  $confirmedReservations = new BehaviorSubject<iReservationResponse[]>([]);
  $pendingReservations = new BehaviorSubject<iReservationResponse[]>([]);
  $allReservations = new BehaviorSubject<iReservationResponse[]>([]);

  baseUrl: string = environment.baseUrl + '/reservation';

  makeReservation(reservationRequest: iReservationCreateRequest) {
    return this.http.post<iResponseStringMessage>(
      this.baseUrl,
      reservationRequest
    );
  }

  getAllReservations() {
    return this.http.get<iReservationResponse[]>(this.baseUrl).pipe(
      tap((res) => {
        this.$allReservations.next(res);
      })
    );
  }

  getConfirmedAndPending() {
    return this.http
      .get<iReservationResponse[]>(this.baseUrl + '/confirmedAndPending')
      .pipe(
        tap((res) => {
          this.$confirmedReservations.next(
            res.filter((reservation) => reservation.status === 'CONFIRMED')
          );
          this.$pendingReservations.next(
            res.filter((reservation) => reservation.status === 'PENDING')
          );
        })
      );
  }

  getAllByLoggedUser() {
    return this.http.get<iReservationResponseForCustomer[]>(
      this.baseUrl + '/byCustomer'
    );
  }

  cancelReservationByUser(reservationId: string) {
    return this.http.patch<iReservationResponseForCustomer>(
      this.baseUrl + '/cancelReservation/' + reservationId,
      {}
    );
  }

  updateStatus(reservationId: string, status: string) {
    return (
      this.http
        .patch<iReservationResponse>(
          this.baseUrl + '/updateStatus/' + reservationId,
          status
        )
        // .pipe(
        //   tap((res) => {
        //     console.log(status);

        //     if (status === 'CONFIRMED') {
        //       let pendingArr = this.$pendingReservations.getValue();
        //       console.log(pendingArr);

        //       let findPendingIndex = pendingArr.findIndex(
        //         (reservation) => reservation.id === reservationId
        //       );
        //       console.log(findPendingIndex);
        //       if (findPendingIndex != null) {
        //         pendingArr.splice(findPendingIndex, 1);
        //         console.log(pendingArr);

        //         this.$pendingReservations.next(pendingArr);
        //       }

        //       let confirmedArr = this.$confirmedReservations.getValue();
        //       confirmedArr.push(res);
        //       this.$confirmedReservations.next(confirmedArr);
        //     } else if (status === 'COMPLETED') {
        //       let confirmedArr = this.$confirmedReservations.getValue();
        //       let findConfirmedIndex = confirmedArr.findIndex(
        //         (reservation) => reservation.id === reservationId
        //       );
        //       if (findConfirmedIndex != null) {
        //         confirmedArr.splice(findConfirmedIndex, 1);
        //         this.$confirmedReservations.next(confirmedArr);
        //       }
        //     } else if (status === 'CANCELLED') {
        //       let pendingArr = this.$pendingReservations.getValue();
        //       let findPendingIndex = pendingArr.findIndex(
        //         (reservation) => reservation.id === reservationId
        //       );
        //       if (findPendingIndex != null) {
        //         pendingArr.splice(findPendingIndex, 1);
        //         this.$pendingReservations.next(pendingArr);
        //       }
        //       let confirmedArr = this.$confirmedReservations.getValue();
        //       let findConfirmedIndex = confirmedArr.findIndex(
        //         (reservation) => reservation.id === reservationId
        //       );
        //       if (findConfirmedIndex != null) {
        //         confirmedArr.splice(findConfirmedIndex, 1);
        //         this.$confirmedReservations.next(confirmedArr);
        //       }
        //     }
        //   })
        // );
        .pipe(
          tap((res) => {
            this.getConfirmedAndPending().subscribe();
          })
        )
    );
  }
}
