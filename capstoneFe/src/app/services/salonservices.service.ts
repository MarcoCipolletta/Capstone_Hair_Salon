import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iSalonServiceResponse } from '../interfaces/salonServices/i-salon-service-response';
import { iSalonServiceCreateRequest } from '../interfaces/salonServices/i-salon-service-create-request';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalonservicesService {
  constructor() {}
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + '/salon-service';

  $selctedService = new BehaviorSubject<iSalonServiceResponse[]>([]);
  allServices$ = new BehaviorSubject<iSalonServiceResponse[]>([]);

  getAllServices() {
    return this.http.get<iSalonServiceResponse[]>(this.baseUrl).pipe(
      tap((res) => {
        this.allServices$.next(res);
      })
    );
  }

  getServiceById(id: string) {
    return this.http.get<iSalonServiceResponse>(this.baseUrl + '/' + id);
  }

  createService(salonService: iSalonServiceCreateRequest) {
    return this.http.post<iResponseStringMessage>(this.baseUrl, salonService);
  }

  updateService(salonService: iSalonServiceResponse, id: string) {
    return this.http
      .put<iSalonServiceResponse>(this.baseUrl + '/' + id, salonService)
      .pipe(
        tap((res) => {
          this.getAllServices().subscribe();
        })
      );
  }

  updateHiddenService(id: string, hidden: boolean) {
    return this.http
      .patch<iResponseStringMessage>(this.baseUrl + '/hide/' + id, hidden)
      .pipe(
        tap((res) => {
          this.getAllServices().subscribe();
        })
      );
  }
}
