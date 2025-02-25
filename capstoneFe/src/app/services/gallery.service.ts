import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { iGalleryItem } from '../interfaces/i-gallery-item';
import { iResponseStringMessage } from '../interfaces/i-response-string-message';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.baseUrl + '/gallery';

  allImage$ = new BehaviorSubject<iGalleryItem[]>([]);

  getAll() {
    return this.http.get<iGalleryItem[]>(this.baseUrl).pipe(
      tap((res) => {
        this.allImage$.next(res);
      })
    );
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<iResponseStringMessage>(this.baseUrl, formData);
  }

  deleteImage(id: string) {
    return this.http.delete<iResponseStringMessage>(
      this.baseUrl + '/delete/' + id
    );
  }
}
