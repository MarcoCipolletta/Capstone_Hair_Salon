import { Component, ElementRef, ViewChild } from '@angular/core';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { CustomerService } from '../../../services/customer.service';
import { SalonservicesService } from '../../../services/salonservices.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent {
  constructor(
    private salonServicesSvc: SalonservicesService,
    private customerSvc: CustomerService
  ) {}
  showCreateReservation = false;
  showReservationHistory = false;
  customers: iCustomerResponseForAdmin[] = [];
  salonServices: iSalonServiceResponse[] = [];

  @ViewChild('createReservationObserver', { static: false })
  createReservationElement!: ElementRef;
  @ViewChild('historyObserver', { static: false }) historyElement!: ElementRef;

  ngAfterViewInit() {
    this.setupObserver(this.createReservationElement, () => {
      this.showCreateReservation = true;
      combineLatest([
        this.customerSvc.getAll(),
        this.salonServicesSvc.getAllServices(),
      ]).subscribe(([customersRes, servicesRes]) => {
        this.customers = customersRes;
        this.salonServices = servicesRes;
      });
    });

    this.setupObserver(this.historyElement, () => {
      this.showReservationHistory = true;
    });
  }

  private setupObserver(element: ElementRef, callback: () => void) {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element.nativeElement);
  }
}
