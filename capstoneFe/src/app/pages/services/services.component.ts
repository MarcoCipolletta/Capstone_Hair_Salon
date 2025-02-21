import { Component } from '@angular/core';
import { SalonservicesService } from '../../services/salonservices.service';
import { iSalonServiceResponse } from '../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../services/time-conversion-svc.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  constructor(
    private servicesSvc: SalonservicesService,
    protected timeConverter: TimeConversionSvcService
  ) {
    this.servicesSvc.getAvailableServices().subscribe((res) => {
      this.services = res;
      console.log(this.services);
    });
  }
  services: iSalonServiceResponse[] = [];
}
