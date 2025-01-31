import { iSalonServiceResponse } from '../salonServices/i-salon-service-response';

export interface iCheckAvailableRequest {
  date: Date;
  services: iSalonServiceResponse[];
}
