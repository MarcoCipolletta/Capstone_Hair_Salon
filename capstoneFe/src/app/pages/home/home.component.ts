import { AuthSvc } from './../../auth/auth.service';
import { Component } from '@angular/core';
import { OpeningHoursService } from '../../services/opening-hours.service';
import { TimeConversionSvcService } from '../../services/time-conversion-svc.service';
import { iOpeningHour } from '../../interfaces/i-opening-hour';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  role: string = '';
  constructor(private authSvc: AuthSvc) {
    this.authSvc.userRole$.subscribe((data) => {
      this.role = data;
    });
  }
}
