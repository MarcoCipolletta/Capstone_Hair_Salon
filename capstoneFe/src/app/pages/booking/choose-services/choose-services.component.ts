import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';

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

  @Output() pageChanged = new EventEmitter<number>();

  ngOnInit() {
    this.getAllServices();
  }

  getAllServices() {
    this.salonServicesSvc.getAllServices().subscribe({
      next: (res) => {
        this.salonServices = res;
        console.log(this.salonServices);
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
    console.log(this.selectedServices);
  }

  totalTimeSelectedServices() {
    let totalTime = 0;
    this.selectedServices.forEach((service) => {
      totalTime += service.duration;
    });
    return this.timeConversionSvc.secondsToDuration(totalTime);
  }

  totalPriceSelectedServices() {
    return this.selectedServices.reduce((a, b) => a + b.price, 0).toFixed(0);
  }

  nextPage() {
    if (this.selectedServices.length > 0) {
      this.salonServicesSvc.$selctedService.next(this.selectedServices);
      this.pageChanged.emit(2);
    }
  }
}
