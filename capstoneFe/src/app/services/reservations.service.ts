import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iReservationCreateRequest } from '../interfaces/reservation/i-reservation-create-request';
import { environment } from '../../environments/environment.development';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';
import { iReservationResponse } from '../interfaces/reservation/i-reservation-response';
import { BehaviorSubject } from 'rxjs';
import { iReservationResponseForCustomer } from '../interfaces/reservation/i-reservation-response-for-customer';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  $newReservation = new BehaviorSubject<iReservationCreateRequest | null>(null);

  baseUrl: string = environment.baseUrl + '/reservation';

  makeReservation(reservationRequest: iReservationCreateRequest) {
    return this.http.post<iResponseStringMessage>(
      this.baseUrl,
      reservationRequest
    );
  }

  getAllReservations() {
    return this.http.get<iReservationResponse[]>(this.baseUrl);
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
}
