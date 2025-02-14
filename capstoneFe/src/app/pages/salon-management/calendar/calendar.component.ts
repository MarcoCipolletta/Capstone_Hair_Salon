import { Component, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import { CalendarService } from '../../../services/calendar.service';
import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale-extreme.css';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private calendarSvc = inject(CalendarService);

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, bootstrap5Plugin, interactionPlugin],
    themeSystem: 'bootstrap5',
    expandRows: true,
    firstDay: 2,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today',
    },
    buttonText: {
      today: 'Oggi',
      prev: '<',
      next: '>',
      dayGridMonth: 'Mese',
      timeGridWeek: 'Settimana',
    },
    initialView: 'timeGridWeek',
    stickyHeaderDates: true,
    initialDate: new Date().toISOString().split('T')[0],
    timeZone: 'local',
    locale: 'it',
    allDaySlot: false,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:30:00',
    slotLabelInterval: '00:30:00',
    height: '100%',
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      hour12: false,
      meridiem: false,
    },

    eventDidMount: (info) => {
      tippy(info.el, {
        content: info.event.extendedProps['description'], // Testo del tooltip
        allowHTML: true, // Se vuoi supportare HTML nel tooltip
        placement: 'top', // Posizione del tooltip (top, bottom, left, right)
        theme: 'light', // Tema chiaro (puoi cambiarlo con CSS)
        trigger: 'click',
        animation: 'scale-extreme',
        arrow: true,
      });
    },
    events: [],
  };

  ngOnInit() {
    this.calendarSvc.events$.subscribe((res) => {
      this.calendarOptions.events = res;
    });
  }
}
