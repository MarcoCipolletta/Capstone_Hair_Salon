import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iCustomerPaged } from '../interfaces/customer/i-customer-paged';
import { iCustomerResponseForAdmin } from '../interfaces/customer/i-customer-response-for-admin';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.baseUrl + '/customer';

  getAllPaged(page: number, size: number, sort?: string[]) {
    let url = this.baseUrl + '/page?page=' + page + '&size=' + size;
    if (sort && sort.length > 0) {
      sort.forEach((s) => {
        url += '&sort=' + sort;
      });
    }
    return this.http.get<iCustomerPaged>(url);
  }

  getCustomerById(id: string) {
    return this.http.get<iCustomerResponseForAdmin>(this.baseUrl + '/id/' + id);
  }
}
