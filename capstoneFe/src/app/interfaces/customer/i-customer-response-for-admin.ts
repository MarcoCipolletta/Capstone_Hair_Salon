import { iReservationResponseForCustomer } from '../reservation/i-reservation-response-for-customer';

export interface iCustomerResponseForAdmin {
  id: string;
  name: string;
  surname: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  reservations: iReservationResponseForCustomer[];
}
