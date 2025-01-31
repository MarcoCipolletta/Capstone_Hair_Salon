import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iCheckAvailableRequest } from '../interfaces/bookingtimes/icheck-available-request';
import { iDayWithAvaibleTime } from '../interfaces/bookingtimes/i-day-with-avaible-time';

@Injectable({
  providedIn: 'root',
})
export class BookingSlotTimesService {
  constructor() {}
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + '/booking';

  getWeekOfDayWithAvaiableTime(bookingCheckRequest: iCheckAvailableRequest) {
    return this.http.post<iDayWithAvaibleTime[]>(
      this.baseUrl + '/get-week',
      bookingCheckRequest
    );
  }

  getDayWithAvaiableTime(bookingCheckRequest: iCheckAvailableRequest) {
    return this.http.post<iDayWithAvaibleTime>(
      this.baseUrl,
      bookingCheckRequest
    );
  }
}
