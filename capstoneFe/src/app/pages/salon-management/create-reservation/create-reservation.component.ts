import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { combineLatest } from 'rxjs';
import { SalonservicesService } from '../../../services/salonservices.service';
import { BookingSlotTimesService } from '../../../services/booking-slot-times.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iDayWithAvaibleTime } from '../../../interfaces/bookingtimes/i-day-with-avaible-time';
import { iCheckAvailableRequest } from '../../../interfaces/bookingtimes/icheck-available-request';
import { iAvailableTime } from '../../../interfaces/bookingtimes/i-available-time';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';
import { ReservationsService } from '../../../services/reservations.service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
})
export class CreateReservationComponent {
  constructor(
    private customerSvc: CustomerService,
    private salonServicesSvc: SalonservicesService,
    private bookingSlotSvc: BookingSlotTimesService,
    private reservationSvc: ReservationsService,
    protected timeConversionSvc: TimeConversionSvcService
  ) {}

  today = new Date().toISOString().split('T')[0];

  customers: iCustomerResponseForAdmin[] = [];
  newCustomer = false;
  selectedCustomer!: string | null;
  chooseDate!: Date | null;

  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  services: iSalonServiceResponse[] = [];
  selectedServices: iSalonServiceResponse[] = [];

  slots!: iDayWithAvaibleTime;
  chooseTime!: iAvailableTime | null;

  ngOnInit() {
    combineLatest([
      this.customerSvc.getAll(),
      this.salonServicesSvc.getAllServices(),
    ]).subscribe(([customersRes, servicesRes]) => {
      this.customers = customersRes;
      this.services = servicesRes;
    });
    console.log(this.selectedServices);
  }

  onDateChange(event: Event) {
    this.chooseDate = new Date((event.target as HTMLInputElement).value);
    console.log(this.chooseDate);

    const bookinSlotRequest: iCheckAvailableRequest = {
      date: this.chooseDate,
      services: this.selectedServices,
    };

    this.bookingSlotSvc
      .getDayWithAvaiableTime(bookinSlotRequest)
      .subscribe((res) => {
        this.chooseTime = null;
        this.slots = res;
      });
  }

  getDayOfWeek(day: number): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    return days[day];
  }

  createReservation() {
    if (!this.newCustomer) {
      console.log(!(this.selectedServices.length <= 0));

      if (!this.selectedCustomer) {
        alert('Devi selezionare un cliente');
        return;
      } else if (this.selectedServices.length <= 0) {
        alert('Devi selezionare almeno un servizio');
        return;
      } else if (!this.chooseDate) {
        alert('Devi selezionare una data');
        return;
      } else if (!this.chooseTime) {
        alert('Devi selezionare un orario');
        return;
      }

      const reservationRequest: iReservationCreateRequest = {
        date: this.chooseDate,
        startTime: this.chooseTime.startTime,
        endTime: this.chooseTime.endTime,
        salonServices: this.selectedServices,
      };
      console.log(this.chooseDate);
      console.log(this.chooseTime);
      console.log(this.selectedServices);
      console.log(this.selectedCustomer);
      this.reservationSvc
        .createReservationByAdmin(reservationRequest, this.selectedCustomer)
        .subscribe((res) => {
          this.selectedCustomer = null;
          this.chooseDate = null;
          this.dateInput.nativeElement.value = '';
          this.selectedServices = [];
          this.chooseTime = null;
        });
    } else {
      return;
    }
  }
}
