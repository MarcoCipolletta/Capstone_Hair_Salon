import { iCustomerResponse } from '../customer/i-customer-response';
import { iSalonServiceResponse } from '../salonServices/i-salon-service-response';

export interface iReservationResponseForCustomer {
  id: string;
  date: Date;
  startTime: number;
  endTime: number;
  status: string;
  salonServices: iSalonServiceResponse[];
  operatorId: string;
}
