import { TimeConversionSvcService } from './time-conversion-svc.service';
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
    private managerScheduleSvc: ManagerScheduleService,
    private timeConversionSvc: TimeConversionSvcService
  ) {
    this.managerScheduleSvc.getAll().subscribe();
    combineLatest([
      this.reservationSvc.$confirmedReservations,
      this.reservationSvc.$pendingReservations,
      this.managerScheduleSvc.managerSchedule$,
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

    let startDate = new Date(eventDate);

    // const startHour = Math.floor(reservation.startTime / 3600);
    // const startMinutes = (reservation.startTime - startHour * 3600) / 60;
    // startDate.setHours(startHour, startMinutes, 0);
    startDate = this.SecondsToDayWithTime(startDate, reservation.startTime);

    let endDate = new Date(eventDate);
    // const endHour = Math.floor(reservation.endTime / 3600);
    // const endMinutes = (reservation.endTime - endHour * 3600) / 60;
    endDate = this.SecondsToDayWithTime(endDate, reservation.endTime);

    return {
      id: reservation.id,
      title: `${reservation.customer.name} ${reservation.customer.surname}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        description: `
       <b>Ora</b>: ${this.timeConversionSvc.secondsToTime(
         reservation.startTime
       )}<br>
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
    } else if (schedule.typeSchedule === 'BLOCKED') {
      return this.mapClosingHoursToEvent(schedule);
    } else {
      return this.mapHolidayToEvent(schedule);
    }
  }

  private mapHolidayToEvent(schedule: iManagerSchedule): iCalendarEvent {
    const eventDate = new Date(schedule.date);

    const startDate = new Date(eventDate);

    startDate.setHours(7, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(21, 30, 0);

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
  private mapClosingHoursToEvent(schedule: iManagerSchedule): iCalendarEvent {
    let eventDate = new Date(schedule.date);
    let eventDateStart = this.SecondsToDayWithTime(
      eventDate,
      schedule.startTime
    );
    let eventDateFinish = this.SecondsToDayWithTime(
      eventDate,
      schedule.endTime
    );

    const event: iCalendarEvent = {
      id: schedule.id,
      title: `${schedule.reason ? schedule.reason : 'Impegno'}`,
      start: eventDateStart.toISOString(),
      end: eventDateFinish.toISOString(),
      extendedProps: {
        description: 'Chiuso per ferie',
      },
      classNames: ['holiday'],
    };

    return event;
  }

  private SecondsToDayWithTime(date: Date, seconds: number) {
    const startHour = Math.floor(seconds / 3600);
    const startMinutes = (seconds - startHour * 3600) / 60;
    let newDate = new Date(date);
    newDate.setHours(startHour, startMinutes, 0);
    return newDate;
  }
}
