import { Component } from '@angular/core';
import { OpeningHoursService } from '../../services/opening-hours.service';
import { TimeConversionSvcService } from '../../services/time-conversion-svc.service';
import { iOpeningHour } from '../../interfaces/i-opening-hour';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
