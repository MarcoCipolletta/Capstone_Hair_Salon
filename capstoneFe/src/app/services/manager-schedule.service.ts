import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';
import { iManagerSchedule } from '../interfaces/managerSchedule/i-manager-schedule';

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

  createSchedule(managerSchedule: iManagerSchedule) {
    return this.http.post<iManagerSchedule>(this.baseUrl, managerSchedule);
  }
}
