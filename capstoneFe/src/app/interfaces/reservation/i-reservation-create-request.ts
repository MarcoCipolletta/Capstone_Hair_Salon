import { iSalonServiceResponse } from '../salonServices/i-salon-service-response';

export interface iReservationCreateRequest {
  date: Date;
  startTime: number;
  endTime: number;
  salonServices: iSalonServiceResponse[];
}
