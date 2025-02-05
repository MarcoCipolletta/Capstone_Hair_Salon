import { inject, Injectable } from '@angular/core';
import { iReservationResponse } from '../interfaces/reservation/i-reservation-response';
import { iCalendarEvent } from '../interfaces/i-calendar-event';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { ReservationsService } from './reservations.service';
import { ManagerScheduleService } from './manager-schedule.service';
import { iManagerSchedule } from '../interfaces/managerSchedule/i-manager-schedule';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  events$ = new BehaviorSubject<iCalendarEvent[]>([]);

  constructor(
    private reservationSvc: ReservationsService,
    private managerScheduleSvc: ManagerScheduleService
  ) {
    combineLatest([
      this.reservationSvc.$confirmedReservations,
      this.reservationSvc.$pendingReservations,
      this.managerScheduleSvc.getAll(),
    ]).subscribe({
      next: ([confirmed, pending, managerSchedule]) => {
        const events: iCalendarEvent[] = [];
        confirmed.forEach((r) => {
          const e = this.mapReservationToEvent(r);
          events.push(e);
        });
        pending.forEach((r) => {
          const e = this.mapReservationToEvent(r);
          events.push(e);
        });
        managerSchedule.forEach((s) => {
          const e = this.mapScheduleToEvent(s);
          events.push(e);
        });
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
  mapScheduleToEvent(schedule: iManagerSchedule): iCalendarEvent {
    if (schedule.typeSchedule === 'HOLIDAY') {
      return this.mapHolidayToEvent(schedule);
    } else {
      return this.mapHolidayToEvent(schedule);
    }
  }

  private mapHolidayToEvent(schedule: iManagerSchedule): iCalendarEvent {
    const eventDate = new Date(schedule.date);

    const startDate = new Date(eventDate);

    startDate.setHours(6, 0, 0);
    console.log(startDate);

    const endDate = new Date(eventDate);
    endDate.setHours(22, 0, 0);

    return {
      id: schedule.id,
      title: `Ferie`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        description: 'Chiuso per ferie',
      },
      classNames: ['holiday'],
    };
  }
}
