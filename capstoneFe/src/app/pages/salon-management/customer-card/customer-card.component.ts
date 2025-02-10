import { Component, Input } from '@angular/core';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.scss',
})
export class CustomerCardComponent {
  @Input() customer!: iCustomerResponseForAdmin;

  viewReservation() {}
}
