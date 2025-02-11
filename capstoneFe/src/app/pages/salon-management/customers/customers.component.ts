import { Component, inject } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { iCustomerPaged } from '../../../interfaces/customer/i-customer-paged';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private customerSvc = inject(CustomerService);
  page = 1;
  customers!: iCustomerResponseForAdmin[];
  collectionSize!: number;
  pageSize: number = 5;

  sortDirection: string = 'asc';

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerSvc
      .getAllPaged(this.page - 1, this.pageSize, [
        `name,${this.sortDirection}`,
        'surname,asc',
      ])
      .subscribe({
        next: (res) => {
          this.customers = res.content;
          this.collectionSize = res.totalElements;
        },
      });
  }

  changeSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadCustomers();
  }
}
