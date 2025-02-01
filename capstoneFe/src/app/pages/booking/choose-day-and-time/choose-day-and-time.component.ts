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
    // this.salonServicesSvc.$selctedService.subscribe({
    //   next: (res) => {
    //     this.selectedServices = res;
    //     this.newReservation.services = this.selectedServices;
    //     this.getWeekOfAvailableTimes(this.date);
    //   },
    // });
    if (sessionStorage.getItem('selectedServices')) {
      if (sessionStorage.getItem('newReservation')) {
        this.newReservation = JSON.parse(
          sessionStorage.getItem('newReservation')!
        );
        this.selectedTime = 'time' + this.newReservation.startTime;
        this.selectedServices = this.newReservation.services;
        this.getPreviousWeek(this.newReservation.date);
        this.isBackActive = true;
      } else {
        this.selectedServices = JSON.parse(
          sessionStorage.getItem('selectedServices')!
        );
        this.newReservation.services = this.selectedServices;
        this.getWeekOfAvailableTimes(this.date);
      }
    }
  }

  getWeekOfAvailableTimes(date: Date) {
    let checkAvailableRequest: iCheckAvailableRequest = {
      date: date,
      services: this.selectedServices,
    };

    this.bookingSlotSvc
      .getWeekOfDayWithAvailableTime(checkAvailableRequest)
      .subscribe((res) => {
        this.weekOfDayAvailableSlots.push(...res);
        if (!this.dayAvailableSlots) {
          this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
        }
      });
  }

  getPreviousWeek(date: Date, defaultMiddleIndex: number = 3) {
    if (!this.dayAvailableSlots) {
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - 3);

      const checkAvailableRequest: iCheckAvailableRequest = {
        date: startDate,
        services: this.selectedServices,
      };

      this.bookingSlotSvc
        .getWeekOfDayWithAvailableTime(checkAvailableRequest)
        .subscribe((res) => {
          this.weekOfDayAvailableSlots = [...res];
          this.dayIndex = defaultMiddleIndex;
          this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
        });
    } else {
      const currentFirstDay = new Date(this.weekOfDayAvailableSlots[0].date);
      let previousWeekStart = new Date(currentFirstDay);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);

      let today = new Date();
      const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (previousWeekStart < today) {
        previousWeekStart = new Date(today);
      }

      const checkAvailableRequest: iCheckAvailableRequest = {
        date: previousWeekStart,
        services: this.selectedServices,
      };

      this.bookingSlotSvc
        .getWeekOfDayWithAvailableTime(checkAvailableRequest)
        .subscribe((res) => {
          const filteredRes = res.filter((item) => {
            const itemDate = new Date(item.date);

            return itemDate >= todayMidnight;
          });

          const newDays = filteredRes.filter(
            (newDay) =>
              !this.weekOfDayAvailableSlots.some(
                (existingDay) =>
                  new Date(existingDay.date).toISOString().split('T')[0] ===
                  new Date(newDay.date).toISOString().split('T')[0]
              )
          );

          this.weekOfDayAvailableSlots = [
            ...newDays,
            ...this.weekOfDayAvailableSlots,
          ];

          this.dayIndex += newDays.length;
          this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
        });
    }
  }

  nextDay() {
    this.selectedTime = '';
    this.dayIndex++;
    this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];

    if (
      this.dayIndex === this.weekOfDayAvailableSlots.length - 2 ||
      this.dayIndex === this.weekOfDayAvailableSlots.length - 1
    ) {
      this.date.setDate(this.date.getDate() + 7);
      this.getWeekOfAvailableTimes(this.date);
    }
    this.isBackActive = true;
  }

  previousDay() {
    this.selectedTime = '';

    this.dayIndex--;
    this.dayAvailableSlots = this.weekOfDayAvailableSlots[this.dayIndex];
    if (
      this.dayAvailableSlots.date.toString() ===
      new Date().toISOString().split('T')[0]
    ) {
      this.isBackActive = false;
      return;
    }
    if (
      (this.dayIndex === 0 || this.dayIndex === 1) &&
      new Date(this.dayAvailableSlots.date).getDate() - new Date().getDate() > 2
    ) {
      this.getPreviousWeek(this.dayAvailableSlots.date);
    }
  }

  selectTime(time: iAvailableTime) {
    this.selectedTime = 'time' + time.startTime;
    this.newReservation.date = this.dayAvailableSlots.date;
    this.newReservation.startTime = time.startTime;
    this.newReservation.endTime = time.endTime;
  }

  nextPage() {
    if (this.selectedTime) {
      sessionStorage.setItem(
        'newReservation',
        JSON.stringify(this.newReservation)
      );
      this.pageChanged.emit(3);
    }
  }
}
