import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-choose-services',
  templateUrl: './choose-services.component.html',
  styleUrl: './choose-services.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChooseServicesComponent {
  constructor(
    private salonServicesSvc: SalonservicesService,
    protected timeConversionSvc: TimeConversionSvcService
  ) {}
  salonServices: iSalonServiceResponse[] = [];
  selectedServices: iSalonServiceResponse[] = [];
  isReserved!: iReservationCreateRequest;

  @Output() pageChanged = new EventEmitter<number>();

  ngOnInit() {
    this.getAllServices();
    if (sessionStorage.getItem('selectedServices')) {
      this.selectedServices = JSON.parse(
        sessionStorage.getItem('selectedServices')!
      );
    }
    if (sessionStorage.getItem('newReservation')) {
      this.isReserved = JSON.parse(sessionStorage.getItem('newReservation')!);
    }
  }

  getAllServices() {
    this.salonServicesSvc.getAvailableServices().subscribe({
      next: (res) => {
        this.salonServices = res;
      },
    });
  }

  getServiceById(id: string) {
    this.salonServicesSvc.getServiceById(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  selectService(service: iSalonServiceResponse) {
    console.log(this.selectedServices);
    console.log(service);

    const alreadyIncluded = this.selectedServices.find(
      (s) => s.id === service.id
    );
    if (alreadyIncluded) {
      this.selectedServices = this.selectedServices.filter(
        (s) => s.id !== service.id
      );
      return;
    }
    this.selectedServices.push(service);
  }

  isServiceSelected(service: iSalonServiceResponse): boolean {
    return this.selectedServices.some((s) => s.id === service.id);
  }

  totalDuration() {
    let totalTime = 0;
    this.selectedServices.forEach((service) => {
      totalTime += service.duration;
    });
    return this.timeConversionSvc.secondsToDuration(totalTime);
  }

  totalPriceSelectedServices() {
    return this.selectedServices.reduce((a, b) => a + b.price, 0).toFixed(0);
  }

  private areServiceArraysEqual(
    arr1: iSalonServiceResponse[],
    arr2: iSalonServiceResponse[]
  ): boolean {
    if (arr1.length !== arr2.length) return false;

    const ids1 = arr1.map((s) => s.id).sort();
    const ids2 = arr2.map((s) => s.id).sort();

    return ids1.every((id, index) => id === ids2[index]);
  }

  nextPage() {
    if (this.selectedServices.length > 0) {
      sessionStorage.setItem(
        'selectedServices',
        JSON.stringify(this.selectedServices)
      );
      if (
        this.isReserved &&
        !this.areServiceArraysEqual(
          this.isReserved.salonServices,
          this.selectedServices
        )
      ) {
        sessionStorage.removeItem('newReservation');
      }

      this.pageChanged.emit(2);
    }
  }
}
