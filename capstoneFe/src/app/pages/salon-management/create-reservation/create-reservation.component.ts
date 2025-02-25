import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { BookingSlotTimesService } from '../../../services/booking-slot-times.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iDayWithAvaibleTime } from '../../../interfaces/bookingtimes/i-day-with-avaible-time';
import { iCheckAvailableRequest } from '../../../interfaces/bookingtimes/icheck-available-request';
import { iAvailableTime } from '../../../interfaces/bookingtimes/i-available-time';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';
import { ReservationsService } from '../../../services/reservations.service';
import { iCustomerCreateByAdminRequest } from '../../../interfaces/customer/i-customer-create-by-admin-request';
import { iReservationAndCustomerCreateByAdminRequest } from '../../../interfaces/reservation/i-reservation-and-customer-create-by-admin-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
})
export class CreateReservationComponent {
  constructor(
    private bookingSlotSvc: BookingSlotTimesService,
    private reservationSvc: ReservationsService,
    protected timeConversionSvc: TimeConversionSvcService,
    private modalSvc: NgbModal
  ) {}

  today = new Date().toISOString().split('T')[0];

  @Input() customers!: iCustomerResponseForAdmin[];
  newCustomer = false;
  selectedCustomer!: string | null;
  chooseDate!: Date | null;

  newCustomerCreate: iCustomerCreateByAdminRequest = {
    name: '',
    surname: '',
    dateOfBirth: new Date(),
    phoneNumber: '',
    email: '',
  };

  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  @Input() services!: iSalonServiceResponse[];
  selectedServices!: iSalonServiceResponse[];

  servicesDisabled: boolean = true;

  updateServiceSelectState(): void {
    if (this.newCustomer) {
      const dob = new Date(this.newCustomerCreate.dateOfBirth);
      const isValid =
        this.newCustomerCreate.name.trim() !== '' &&
        this.newCustomerCreate.surname.trim() !== '' &&
        dob < new Date() &&
        this.newCustomerCreate.phoneNumber.trim() !== '' &&
        this.newCustomerCreate.email.trim() !== '';
      this.servicesDisabled = !isValid;
    }
  }

  updateChangeValueOfNewCustomer() {
    this.newCustomerCreate = {
      name: '',
      surname: '',
      dateOfBirth: new Date(),
      phoneNumber: '',
      email: '',
    };
  }

  slots!: iDayWithAvaibleTime;
  chooseTime!: iAvailableTime | null;

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
    if (this.selectedServices.length <= 0) {
      alert('Devi selezionare almeno un servizio');
      return;
    } else if (!this.chooseDate) {
      alert('Devi selezionare una data');
      return;
    } else if (!this.chooseTime) {
      alert('Devi selezionare un orario');
      return;
    }
    if (!this.newCustomer) {
      if (!this.selectedCustomer) {
        alert('Devi selezionare un cliente');
        return;
      }

      const reservationRequest: iReservationCreateRequest = {
        date: this.chooseDate,
        startTime: this.chooseTime.startTime,
        endTime: this.chooseTime.endTime,
        salonServices: this.selectedServices,
      };

      this.reservationSvc
        .createReservationByAdmin(reservationRequest, this.selectedCustomer)
        .subscribe((res) => {
          this.selectedCustomer = null;
          this.chooseDate = null;
          this.dateInput.nativeElement.value = '';
          this.selectedServices = [];
          this.chooseTime = null;
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
        });
    } else {
      const reservationRequest: iReservationCreateRequest = {
        date: this.chooseDate,
        startTime: this.chooseTime.startTime,
        endTime: this.chooseTime.endTime,
        salonServices: this.selectedServices,
      };
      const createReservationAndCustomerRequest: iReservationAndCustomerCreateByAdminRequest =
        {
          customer: this.newCustomerCreate,
          reservation: reservationRequest,
        };
      this.reservationSvc
        .createReservationAndCustomerByAdmin(
          createReservationAndCustomerRequest
        )
        .subscribe((res) => {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.selectedCustomer = null;
          this.chooseDate = null;
          this.dateInput.nativeElement.value = '';
          this.selectedServices = [];
          this.chooseTime = null;
          this.newCustomer = false;
          this.newCustomerCreate.name = '';
          this.newCustomerCreate.surname = '';
          this.newCustomerCreate.dateOfBirth = new Date();
          this.newCustomerCreate.phoneNumber = '';
          this.newCustomerCreate.email = '';
        });
    }
  }
}
