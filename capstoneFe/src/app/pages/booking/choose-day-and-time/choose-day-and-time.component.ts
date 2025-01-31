import { iCheckAvailableRequest } from './../../../interfaces/bookingtimes/icheck-available-request';
import { Component, inject } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { BookingSlotTimesService } from '../../../services/booking-slot-times.service';
import { iAvailableTime } from '../../../interfaces/bookingtimes/i-available-time';
import { iDayWithAvaibleTime } from '../../../interfaces/bookingtimes/i-day-with-avaible-time';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';

@Component({
  selector: 'app-choose-day-and-time',
  templateUrl: './choose-day-and-time.component.html',
  styleUrl: './choose-day-and-time.component.scss',
})
export class ChooseDayAndTimeComponent {
  private salonServicesSvc = inject(SalonservicesService);
  private bookingSlotSvc = inject(BookingSlotTimesService);
  protected timeConversionSvc = inject(TimeConversionSvcService);

  weekOfDayAvailableSlots: iDayWithAvaibleTime[] = [];
  dayAvailableSlots!: iDayWithAvaibleTime;
  selectedServices: iSalonServiceResponse[] = [];
  date: Date = new Date();
  dayIndex: number = 0;
  isBackActive: boolean = false;

  ngOnInit() {
    this.salonServicesSvc.$selctedService.subscribe({
      next: (res) => {
        this.selectedServices = res;
        console.log(this.selectedServices);
        this.getWeekOfAvailableTimes(this.date);
      },
    });
  }

  getWeekOfAvailableTimes(date: Date) {
    let checkAvailableRequest: iCheckAvailableRequest = {
      date: date,
      services: this.selectedServices,
    };

    this.bookingSlotSvc
      .getWeekOfDayWithAvaiableTime(checkAvailableRequest)
      .subscribe((res) => {
        this.weekOfDayAvailableSlots.push(...res);
        if (!this.dayAvailableSlots) {
          this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
        }
        console.log(this.dayAvailableSlots);
      });
  }

  nextDay() {
    this.dayIndex++;
    this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
    console.log(this.dayAvailableSlots);

    console.log('dayIndex:', this.dayIndex);
    console.log('weekOfDayAvailableSlots:', this.weekOfDayAvailableSlots);
    console.log(
      'weekOfDayAvailableSlots[dayIndex]:',
      this.weekOfDayAvailableSlots[this.dayIndex]
    );

    setTimeout(() => {
      console.log('Dopo timeout - dayAvailableSlots:', this.dayAvailableSlots);
      console.log(
        'Dopo timeout - availableTimes:',
        this.dayAvailableSlots?.availableTimes || 'Ancora undefined'
      );
    }, 2000);

    if (this.dayIndex === this.weekOfDayAvailableSlots.length - 2) {
      console.log('day index =>' + this.dayIndex);

      this.date.setDate(this.date.getDate() + 7);
      this.getWeekOfAvailableTimes(this.date);
    }
    this.isBackActive = true;
  }

  previousDay() {
    console.log(this.dayIndex);

    this.dayIndex--;
    this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
    if (this.dayIndex === 0) {
      this.isBackActive = false;
    }
  }
}
