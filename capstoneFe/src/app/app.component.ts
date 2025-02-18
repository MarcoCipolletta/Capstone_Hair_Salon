import { Component, inject } from '@angular/core';
import { AuthSvc } from './auth/auth.service';

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

  ngOnInit(): void {
    this.loadGoogleMapsScript('AIzaSyBknHV9J5rGAnvfHtlqE_aLsYrbX3UQqjo');
  }

  loadGoogleMapsScript(apiKey: string): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
