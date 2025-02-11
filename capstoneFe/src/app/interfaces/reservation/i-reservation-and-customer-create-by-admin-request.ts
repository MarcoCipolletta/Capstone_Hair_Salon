import { iCustomerCreateByAdminRequest } from '../customer/i-customer-create-by-admin-request';
import { iReservationCreateRequest } from './i-reservation-create-request';

export interface iReservationAndCustomerCreateByAdminRequest {
  customer: iCustomerCreateByAdminRequest;
  reservation: iReservationCreateRequest;
}
