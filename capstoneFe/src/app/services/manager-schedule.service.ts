import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';
import { iManagerSchedule } from '../interfaces/managerSchedule/i-manager-schedule';
import { iCreateManagerSchedule } from '../interfaces/managerSchedule/i-manager-schedule-create';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';

@Injectable({
  providedIn: 'root',
})
export class ManagerScheduleService {
  constructor(private http: HttpClient) {}

  managerSchedule$ = new BehaviorSubject<iManagerSchedule[]>([]);
  baseUrl: string = environment.baseUrl + '/manager-schedule';

  getAll() {
    return this.http.get<iManagerSchedule[]>(this.baseUrl).pipe(
      tap((res) => {
        this.managerSchedule$.next(res);
      })
    );
  }

  createSchedule(managerSchedule: iCreateManagerSchedule) {
    return this.http
      .post<iResponseStringMessage>(this.baseUrl, managerSchedule)
      .pipe(
        tap((res) => {
          this.getAll().subscribe();
        })
      );
  }

  deleteSchedule(id: string) {
    return this.http
      .delete<iResponseStringMessage>(this.baseUrl + '/' + id)
      .pipe(
        tap((res) => {
          this.getAll().subscribe();
        })
      );
  }
}
