import { Component, inject } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
})
export class CreateReservationComponent {
  private customerSvc = inject(CustomerService);

  customers: iCustomerResponseForAdmin[] = [];
  selectedCustomer: string = '';
  searchTerm: string = '';

  ngOnInit() {
    this.customerSvc.getAll().subscribe((res) => {
      this.customers = res;
    });
  }

  filteredCustomers(): iCustomerResponseForAdmin[] {
    return this.customers.filter((customer) =>
      `${customer.name} ${customer.surname}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }
}
