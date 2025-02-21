import { Component, inject, Input } from '@angular/core';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { SalonservicesService } from '../../../services/salonservices.service';
import { cloneElement } from '@fullcalendar/core/preact.js';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  constructor(
    protected timeConverter: TimeConversionSvcService,
    protected salonServicesSvc: SalonservicesService
  ) {}

  isEditing: boolean = false;
  @Input() service!: iSalonServiceResponse;
  durationHours = 0;
  durationMinutes = 0;
  notEditedService!: iSalonServiceResponse;

  ngOnChanges() {
    if (this.service) {
      this.notEditedService = structuredClone(this.service);
      this.durationHours = Math.floor(this.service.duration / 3600);
      this.durationMinutes = Math.floor(
        (this.service.duration - this.durationHours * 3600) / 60
      );
    }
  }

  edit() {
    this.service = structuredClone(this.notEditedService);
    this.isEditing = !this.isEditing;
  }

  save() {
    this.service.duration = this.timeConverter.setDuration(
      this.durationHours,
      this.durationMinutes
    );
    this.service.price = parseInt(this.service.price.toFixed(0));
    this.salonServicesSvc
      .updateService(this.service, this.service.id)
      .subscribe((res) => {
        this.isEditing = false;
      });
  }

  validateMinutes() {
    if (this.durationMinutes < 0) {
      this.durationMinutes = 0;
    } else if (this.durationMinutes > 59) {
      this.durationMinutes = 59;
    }
  }

  toggleHide() {
    this.service.hidden = !this.service.hidden;
    this.salonServicesSvc
      .updateHiddenService(this.service.id, this.service.hidden)
      .subscribe((res) => {});
    this.isEditing = false;
  }
}
