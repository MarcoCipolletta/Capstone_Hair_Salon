import { Component, inject } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private salonServicesSvc = inject(SalonservicesService);
  services: iSalonServiceResponse[] = [];
  isCollapsed1 = false;
  isCollapsed2 = true;

  ngOnInit() {
    this.salonServicesSvc.getAllServices().subscribe((res) => {
      this.services = res;
    });
  }

  open1() {
    this.isCollapsed1 = false;
    this.isCollapsed2 = true;
  }
  open2() {
    this.isCollapsed1 = true;
    this.isCollapsed2 = false;
  }
}
