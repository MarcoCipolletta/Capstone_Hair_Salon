import { Component, inject } from '@angular/core';
import { SalonservicesService } from '../../../services/salonservices.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  constructor(private salonServicesSvc: SalonservicesService) {}
  services: iSalonServiceResponse[] = [];
  isCollapsed1 = false;
  isCollapsed2 = true;

  ngOnInit() {
    this.salonServicesSvc.allServices$.subscribe((res) => {
      this.services = res;
    });
    this.salonServicesSvc.getAllServices().subscribe();
  }

  open1() {
    if (!this.isCollapsed2) {
      this.salonServicesSvc.getAllServices().subscribe();
    }
    this.isCollapsed1 = false;
    this.isCollapsed2 = true;
  }
  open2() {
    this.isCollapsed1 = true;
    this.isCollapsed2 = false;
  }
}
