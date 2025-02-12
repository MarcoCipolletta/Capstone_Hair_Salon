import { Component, Input, ViewChild } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationResponse } from '../../../interfaces/reservation/i-reservation-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrl: './reservation-history.component.scss',
})
export class ReservationHistoryComponent {
  constructor(
    private reservationSvc: ReservationsService,
    protected timeConverter: TimeConversionSvcService
  ) {}
  page = 1;
  collectionSize!: number;
  pageSize: number = 5;
  reservations: iReservationResponse[] = [];
  @Input() customers!: iCustomerResponseForAdmin[];
  selectedCustomer!: string | null;

  selectedStatus!: string | null;
  statuses = [
    { value: 'PENDING', name: 'Da confermare' },
    { value: 'CONFIRMED', name: 'Confermate' },
    { value: 'COMPLETED', name: 'Completate' },
    { value: 'CANCELLED', name: 'Annullate' },
  ];

  @Input() salonServices!: iSalonServiceResponse[];
  selectedService!: string | null;

  url = '/page';

  onCustomerSelected() {
    this.selectedService = null;
    this.selectedStatus = null;
    if (this.selectedCustomer === null) {
      this.getAll();
      return;
    }
    this.getByCustomer();
  }

  onServiceSelected() {
    this.selectedCustomer = null;
    this.selectedStatus = null;
    if (this.selectedService === null) {
      this.getAll();
      return;
    }
    this.getByService();
  }

  onStatusSelected() {
    this.selectedService = null;
    this.selectedCustomer = null;
    if (this.selectedStatus === null) {
      this.getAll();
      return;
    }
    this.getByStatus();
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.url = '/page';
    this.page = 1;

    this.reservationSvc
      .getPagedReservation(this.url, this.page - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reservations = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }

  getByCustomer() {
    this.url = '/pageCustomer/' + this.selectedCustomer;
    this.page = 1;

    this.reservationSvc
      .getPagedReservation(this.url, this.page - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reservations = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }
  getByService() {
    this.url = '/pageSalonService/' + this.selectedService;
    this.page = 1;
    this.reservationSvc
      .getPagedReservation(this.url, this.page - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reservations = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }

  getByStatus() {
    this.url = '/pageStatus/' + this.selectedStatus;
    this.page = 1;

    this.reservationSvc
      .getPagedReservation(this.url, this.page - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reservations = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }

  setStatus(status: string) {
    if (status === 'PENDING') {
      return 'Da confermare';
    } else if (status === 'CONFIRMED') {
      return 'Confermato';
    } else if (status === 'COMPLETED') {
      return 'Completato';
    } else if (status === 'CANCELLED') {
      return 'Annullato';
    }
    return '';
  }

  getTotalDuration(services: iSalonServiceResponse[]) {
    let total = services.reduce((a, b) => a + b.duration, 0);
    return this.timeConverter.secondsToDuration(total);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  }

  loadReservation() {
    this.reservationSvc
      .getPagedReservation(this.url, this.page - 1, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reservations = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }
}
