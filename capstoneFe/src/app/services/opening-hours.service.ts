import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iOpeningHour } from '../interfaces/i-opening-hour';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpeningHoursService {
  constructor(private http: HttpClient) {}

  baseUrl: string = environment.baseUrl + '/opening-hours';
  openingDays$ = new BehaviorSubject<iOpeningHour[]>([]);

  getAll() {
    return this.http.get<iOpeningHour[]>(this.baseUrl).pipe(
      tap((res) => {
        this.openingDays$.next(res);
      })
    );
  }

  updateOpeningHour(id: string, openingHour: iOpeningHour) {
    return this.http.put<iOpeningHour>(this.baseUrl + '/' + id, openingHour);
  }
}
