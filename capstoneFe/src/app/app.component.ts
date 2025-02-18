import { Component, inject } from '@angular/core';
import { AuthSvc } from './auth/auth.service';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Nicoletta & Sandro';
  isLoading = true;

  constructor(private authSvc: AuthSvc) {
    if (!localStorage.getItem('accessData')) {
      this.isLoading = false;
    }
    this.authSvc.restoreUser()?.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.authSvc.logout();
        this.isLoading = false;
      },
    });
  }

  apikey = environment.mapsApiKey;

  ngOnInit(): void {
    this.loadGoogleMapsScript(this.apikey);
  }

  loadGoogleMapsScript(apiKey: string): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
