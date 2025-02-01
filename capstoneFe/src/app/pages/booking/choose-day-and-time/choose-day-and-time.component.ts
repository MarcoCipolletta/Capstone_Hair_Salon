import { iCheckAvailableRequest } from './../../../interfaces/bookingtimes/icheck-available-request';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { BookingSlotTimesService } from '../../../services/booking-slot-times.service';
import { iAvailableTime } from '../../../interfaces/bookingtimes/i-available-time';
import { iDayWithAvaibleTime } from '../../../interfaces/bookingtimes/i-day-with-avaible-time';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';

@Component({
  selector: 'app-choose-day-and-time',
  templateUrl: './choose-day-and-time.component.html',
  styleUrl: './choose-day-and-time.component.scss',
})
export class ChooseDayAndTimeComponent {
  private salonServicesSvc = inject(SalonservicesService);
  private bookingSlotSvc = inject(BookingSlotTimesService);
  protected timeConversionSvc = inject(TimeConversionSvcService);
  private reservationSvc = inject(ReservationsService);

  weekOfDayAvailableSlots: iDayWithAvaibleTime[] = [];
  dayAvailableSlots!: iDayWithAvaibleTime;
  selectedServices: iSalonServiceResponse[] = [];
  date: Date = new Date();
  dayIndex: number = 0;
  selectedTime: string = '';
  isBackActive: boolean = false;
  newReservation: iReservationCreateRequest = {
    date: new Date(),
    startTime: 0,
    endTime: 0,
    services: [],
  };

  @Output() pageChanged = new EventEmitter<number>();

  ngOnInit() {
    this.salonServicesSvc.$selctedService.subscribe({
      next: (res) => {
        this.selectedServices = res;
        this.newReservation.services = this.selectedServices;
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
    console.log(this.dayAvailableSlots.availableTimes);

    if (
      this.dayIndex === this.weekOfDayAvailableSlots.length - 2 ||
      this.dayIndex === this.weekOfDayAvailableSlots.length - 1
    ) {
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

  selectTime(time: iAvailableTime, id: string) {
    this.selectedTime = id;
    this.newReservation.date = this.dayAvailableSlots.date;
    this.newReservation.startTime = time.startTime;
    this.newReservation.endTime = time.endTime;
  }

  nextPage() {
    if (this.selectedTime) {
      this.reservationSvc.$newReservation.next(this.newReservation);
      sessionStorage.setItem(
        'newReservation',
        JSON.stringify(this.newReservation)
      );
      this.pageChanged.emit(3);
    }
  }
}
