import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';

@NgModule({
  declarations: [ContactsComponent],
  imports: [CommonModule, ContactsRoutingModule, GoogleMapsModule],
})
export class ContactsModule {}
