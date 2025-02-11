import { Component, inject, Input } from '@angular/core';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.scss',
})
export class CustomerCardComponent {
  private router = inject(Router);
  @Input() customer!: iCustomerResponseForAdmin;

  viewReservation() {
    this.router.navigate([`/salonManagement/customers/${this.customer.id}`]);
  }
}
