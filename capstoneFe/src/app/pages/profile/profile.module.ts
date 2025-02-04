import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MyReservationComponent } from './my-reservation/my-reservation.component';
import { ReservationCardComponent } from './reservation-card/reservation-card.component';


@NgModule({
  declarations: [
    ProfileComponent,
    MyReservationComponent,
    ReservationCardComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
