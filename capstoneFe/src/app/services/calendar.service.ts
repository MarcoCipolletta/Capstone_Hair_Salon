import { Injectable } from '@angular/core';
import { iReservationResponse } from '../interfaces/reservation/i-reservation-response';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor() {}

  mapReservationToEvent(reservation: iReservationResponse) {
    const eventDate = new Date(reservation.date);

    const startDate = new Date(eventDate);

    const startHour = Math.floor(reservation.startTime / 3600);
    const startMinutes = (reservation.startTime - startHour * 3600) / 60;
    startDate.setHours(startHour, startMinutes, 0);

    const endDate = new Date(eventDate);
    const endHour = Math.floor(reservation.endTime / 3600);
    const endMinutes = (reservation.endTime - endHour * 3600) / 60;
    endDate.setHours(endHour, endMinutes, 0);

    return {
      id: reservation.id,
      title: `Prenotazione: ${
        reservation.customer?.name + ' ' + reservation.customer?.surname
      } \n Servizi: ${reservation.salonServices
        ?.map((service) => service.name)
        .join(', ')}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      // backgroundColor: '#000000',
      // borderColor: '#88425a',
      // textColor: '#88425a',
      classNames: ['appointment'],
    };
  }
}
