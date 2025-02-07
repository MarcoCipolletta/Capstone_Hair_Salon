import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { iOpeningHour } from '../../../interfaces/i-opening-hour';
import { OpeningHoursService } from '../../../services/opening-hours.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';

@Component({
  selector: 'app-card-opening-hour',
  templateUrl: './card-opening-hour.component.html',
  styleUrl: './card-opening-hour.component.scss',
})
export class CardOpeningHourComponent {
  protected timeConversionSvc = inject(TimeConversionSvcService);
  protected openingHoursSvc = inject(OpeningHoursService);

  isEditing: boolean = false;
  openAllDay: boolean = false;
  openingTime: string = '';
  closingTime: string = '';

  launchBreakStartTime: string = '';
  launchBreakEndTime: string = '';

  @Input() day!: iOpeningHour;
  newDay!: iOpeningHour;

  edit() {
    if (this.isEditing) {
      this.newDay = structuredClone(this.day);
    }
    this.isEditing = !this.isEditing;
  }

  ngOnChanges() {
    if (this.day) {
      this.newDay = structuredClone(this.day);
      console.log(this.newDay);

      this.openAllDay =
        this.day.launchBreakStartTime === 0 &&
        this.day.launchBreakEndTime === 0;

      this.openingTime = this.timeConversionSvc.secondsToTime(
        this.day.openingTime
      );
      this.closingTime = this.timeConversionSvc.secondsToTime(
        this.day.closingTime
      );

      this.launchBreakStartTime = this.timeConversionSvc.secondsToTime(
        this.day.launchBreakStartTime
      );
      this.launchBreakEndTime = this.timeConversionSvc.secondsToTime(
        this.day.launchBreakEndTime
      );
    }
  }

  save() {
    this.day.openingTime = this.timeConversionSvc.timeToSeconds(
      this.openingTime
    );
    this.day.closingTime = this.timeConversionSvc.timeToSeconds(
      this.closingTime
    );
    this.day.launchBreakStartTime = this.timeConversionSvc.timeToSeconds(
      this.launchBreakStartTime
    );
    this.day.launchBreakEndTime = this.timeConversionSvc.timeToSeconds(
      this.launchBreakEndTime
    );
    this.isEditing = !this.isEditing;

    this.day.closed = this.newDay.closed;

    if (this.day.closed) {
      this.day.closingTime = 0;
      this.day.openingTime = 0;
      this.day.launchBreakEndTime = 0;
      this.day.launchBreakStartTime = 0;
    }
    this.openingHoursSvc.updateOpeningHour(this.day.id, this.day).subscribe();
  }

  get dayName() {
    switch (this.day.day) {
      case 'MONDAY':
        return 'LUNEDI';
      case 'TUESDAY':
        return 'MARTEDI';
      case 'WEDNESDAY':
        return 'MERCOLEDI';
      case 'THURSDAY':
        return 'GIOVEDI';
      case 'FRIDAY':
        return 'VENERDI';
      case 'SATURDAY':
        return 'SABATO';
      case 'SUNDAY':
        return 'DOMENICA';
      default:
        return 'GIORNO';
    }
  }
}
