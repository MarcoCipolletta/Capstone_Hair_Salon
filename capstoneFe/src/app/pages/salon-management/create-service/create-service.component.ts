import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iSalonServiceCreateRequest } from '../../../interfaces/salonServices/i-salon-service-create-request';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { SalonservicesService } from '../../../services/salonservices.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss',
})
export class CreateServiceComponent {
  form!: FormGroup;
  service: iSalonServiceCreateRequest = {
    name: '',
    price: 0,
    duration: 0,
  };

  constructor(
    private timeConverter: TimeConversionSvcService,
    private salonServicesSvc: SalonservicesService,
    private modalSvc: NgbModal
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      price: new FormControl(0, [Validators.required, Validators.min(1)]),
      durationHours: new FormControl(0, [
        Validators.required,
        Validators.max(7),
      ]),
      durationMinutes: new FormControl(0, [
        Validators.required,
        Validators.max(59),
      ]),
    });
  }

  getError(fieldName: string) {
    const control = this.form.get(fieldName);
    if (control?.errors!['required']) {
      return 'Campo obbligatorio';
    } else if (control?.hasError('max') && fieldName === 'durationMinutes') {
      return 'Puoi impostare al massimo 59 minuti';
    } else if (control?.hasError('max') && fieldName === 'durationHours') {
      return 'Puoi impostare al massimo 7 ore';
    } else if (control?.errors!['min'] && fieldName === 'price') {
      return 'Almeno deve costare 1€!';
    }

    return null;
  }

  isInvalidTouched(fieldName: string) {
    return (
      this.form.get(fieldName)?.invalid && this.form.get(fieldName)?.touched
    );
  }

  save() {
    this.service.name = this.form.controls['name'].value;
    this.service.description = this.form.controls['description'].value;
    this.service.price = this.form.controls['price'].value;
    this.service.duration = this.timeConverter.setDuration(
      this.form.controls['durationHours'].value,
      this.form.controls['durationMinutes'].value
    );
    this.salonServicesSvc.createService(this.service).subscribe((res) => {
      const modalRef = this.modalSvc.open(ModalComponent, {
        windowClass: 'custom-success-modal',
      });
      modalRef.componentInstance.message = res.message;
    });

    this.form.reset();
  }
}
