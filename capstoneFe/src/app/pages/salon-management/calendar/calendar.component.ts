import { Component, inject } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { ReservationsService } from '../../../services/reservations.service';
import { CalendarService } from '../../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private reservationSvc = inject(ReservationsService);
  private calendarSvc = inject(CalendarService);

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, bootstrap5Plugin, interactionPlugin],
    themeSystem: 'bootstrap5',
    expandRows: true,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today',
    },
    buttonText: {
      today: 'Oggi', // testo pulsante "today"
      prev: '<',
      next: '>',
      dayGridMonth: 'Mese',
      timeGridWeek: 'Settimana',
    },
    initialView: 'timeGridWeek',
    initialDate: new Date().toISOString().split('T')[0],
    timeZone: 'local',
    locale: 'it',
    allDaySlot: false,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:30:00',
    slotLabelInterval: '00:30:00',
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      hour12: false,
      meridiem: false,
    },
    eventClick: (arg) => this.handleEventClick(arg),

    events: [],
  };

  ngOnInit() {
    this.reservationSvc.getAllReservations().subscribe({
      next: (res) => {
        const events: any = [];
        res.forEach((r) => {
          const e = this.calendarSvc.mapReservationToEvent(r);
          if (this.calendarOptions.events) events.push(e);
        });
        this.calendarOptions.events = events;
      },
    });
  }

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }
  handleEventClick(arg: EventClickArg) {
    console.log('event clicked! ' + arg.event.title);
  }
}
