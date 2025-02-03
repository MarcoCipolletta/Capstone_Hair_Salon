import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';

@Component({
  selector: 'app-choose-services',
  templateUrl: './choose-services.component.html',
  styleUrl: './choose-services.component.scss',
})
export class ChooseServicesComponent {
  private salonServicesSvc = inject(SalonservicesService);
  timeConversionSvc = inject(TimeConversionSvcService);
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
    this.salonServicesSvc.getAllServices().subscribe({
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
    if (this.selectedServices.includes(service)) {
      this.selectedServices.splice(this.selectedServices.indexOf(service), 1);
      return;
    }
    this.selectedServices.push(service);
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
