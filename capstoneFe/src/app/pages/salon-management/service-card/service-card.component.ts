import { Component, inject } from '@angular/core';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  protected timeConverter = inject(TimeConversionSvcService);

  service: iSalonServiceResponse = {
    id: '',
    name: 'piega',
    description: '',
    price: 36.5,
    duration: 900,
  };
}
