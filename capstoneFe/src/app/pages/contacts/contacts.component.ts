import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  center: google.maps.LatLngLiteral = { lat: -34.397, lng: 150.644 };
  zoom = 17; // Imposta il livello di zoom
  linkMap: string = `https://www.google.com/maps/search/?api=1&query=${this.center.lat},${this.center.lng}`;
  markerTitle = 'The Secret Plate';
  customIcon: google.maps.Icon | undefined;

  ngOnInit() {
    this.customIcon = {
      url: 'markerMap.png', // URL dell'icona
      scaledSize: new google.maps.Size(60, 60), // Usa google.maps.Size
      origin: new google.maps.Point(5, -7), // Usa google.maps.Point
    };
  }
  onMarkerClick() {
    window.open(this.linkMap, '_blank'); // Apre Google Maps in una nuova scheda
  }

  sendEmail() {}
}
