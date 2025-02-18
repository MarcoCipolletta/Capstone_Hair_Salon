import { Component } from '@angular/core';
import { OpeningHoursService } from '../../../services/opening-hours.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iOpeningHour } from '../../../interfaces/i-opening-hour';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.scss',
})
export class OpeningHoursComponent {
  constructor(
    private openingHoursSvc: OpeningHoursService,
    protected timeConversionSvc: TimeConversionSvcService
  ) {}

  openingHours: iOpeningHour[] = [];
  ngOnInit(): void {
    this.openingHoursSvc.getAll().subscribe((res) => {
      this.openingHours = res;
      console.log(res);
    });
  }

  getDay(day: string) {
    switch (day) {
      case 'MONDAY':
        return 'LUN';
      case 'TUESDAY':
        return 'MAR';
      case 'WEDNESDAY':
        return 'MER';
      case 'THURSDAY':
        return 'GIO';
      case 'FRIDAY':
        return 'VEN';
      case 'SATURDAY':
        return 'SAB';
      case 'SUNDAY':
        return 'DOM';
      default:
        return '';
    }
  }
}
