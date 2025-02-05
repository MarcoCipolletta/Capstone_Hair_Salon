import { inject, Injectable } from '@angular/core';
import { iReservationResponse } from '../interfaces/reservation/i-reservation-response';
import { iCalendarEvent } from '../interfaces/i-calendar-event';
import { BehaviorSubject } from 'rxjs';
import { ReservationsService } from './reservations.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  events$ = new BehaviorSubject<iCalendarEvent[]>([]);

  constructor(private reservationSvc: ReservationsService) {
    this.reservationSvc.getConfirmedAndPending().subscribe({
      next: (res) => {
        const events: any = [];

        res.forEach((r) => {
          const e = this.mapReservationToEvent(r);
          events.push(e);
        });
        console.log(events);

        this.events$.next(events);
      },
    });
  }

  mapReservationToEvent(reservation: iReservationResponse): iCalendarEvent {
    const eventDate = new Date(reservation.date);

    const startDate = new Date(eventDate);

    const startHour = Math.floor(reservation.startTime / 3600);
    const startMinutes = (reservation.startTime - startHour * 3600) / 60;
    startDate.setHours(startHour, startMinutes, 0);

    const endDate = new Date(eventDate);
    const endHour = Math.floor(reservation.endTime / 3600);
    const endMinutes = (reservation.endTime - endHour * 3600) / 60;
    endDate.setHours(endHour, endMinutes, 0);

    console.log(
      `${reservation.salonServices.map((service) => service.name).join('\n')}`
    );

    return {
      id: reservation.id,
      title: `${reservation.customer.name} ${reservation.customer.surname}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        description: `
       <b>Ora</b>: ${startHour}:${startMinutes}<br>
       <b>Cliente</b>:
        ${reservation.customer.name + ' ' + reservation.customer.surname}<br>
        <b>Servizi</b>:
        ${
          '<br>- ' +
          reservation.salonServices
            .map((service) => service.name)
            .join('<br>- ')
        }
        ${
          reservation.status === 'CONFIRMED'
            ? '<br><b>Confermato</b>'
            : '<br><b>Da confermare</b>'
        }
        `,
      },
      classNames: ['appointment'],
    };
  }
}
