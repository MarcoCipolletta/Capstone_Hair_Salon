import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iResponseStringMessage } from '../../interfaces/i-response-string-message';
import { environment } from '../../../environments/environment.development';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  form: FormGroup;

  baseUrl = environment.baseUrl + '/email';

  constructor(private http: HttpClient, private modalSvc: NgbModal) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(25),
      ]),
    });

    this.customIcon = {
      url: 'markerMap.png',
      scaledSize: new google.maps.Size(60, 60),
      origin: new google.maps.Point(15, -5),
    };
  }

  isInvalidTouched(fieldName: string) {
    return (
      this.form.get(fieldName)?.invalid && this.form.get(fieldName)?.touched
    );
  }

  getError(fieldName: string) {
    const control = this.form.get(fieldName);
    if (control?.errors!['required']) {
      return 'Campo obbligatorio';
    } else if (control?.errors!['email']) {
      return 'Email non valida';
    } else if (control?.hasError('minlength')) {
      return 'Devi scrivere almeno 25 caratteri';
    }

    return null;
  }

  center: google.maps.LatLngLiteral = {
    lat: 43.25673817939792,
    lng: 13.758941405660963,
  };
  zoom = 18;
  linkMap: string = `https://maps.app.goo.gl/CA4szVKnkto5LF7v6`;
  markerTitle = 'Parrucchieri Nicoletta & Sandro ';
  customIcon: google.maps.Icon | undefined;

  onMarkerClick() {
    window.open(this.linkMap, '_blank'); // Apre Google Maps in una nuova scheda
  }

  sendEmail() {
    if (this.form.valid) {
      this.http
        .post<iResponseStringMessage>(this.baseUrl, this.form.value)
        .subscribe((res) => {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.form.reset();
        });
    }
  }
}
