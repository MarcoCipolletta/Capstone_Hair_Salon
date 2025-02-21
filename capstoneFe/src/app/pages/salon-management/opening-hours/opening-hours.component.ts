import { Component, inject } from '@angular/core';
import { iOpeningHour } from '../../../interfaces/i-opening-hour';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { OpeningHoursService } from '../../../services/opening-hours.service';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.scss',
})
export class OpeningHoursComponent {
  constructor(private openingHoursSvc: OpeningHoursService) {}

  days: iOpeningHour[] = [];

  ngOnInit() {
    this.openingHoursSvc.openingDays$.subscribe((res) => {
      this.days = res;
    });

    this.openingHoursSvc.getAll().subscribe();
  }
}
