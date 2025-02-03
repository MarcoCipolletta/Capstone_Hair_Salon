import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { ChooseServicesComponent } from './choose-services/choose-services.component';
import { NgIconsModule } from '@ng-icons/core';
import { ChooseDayAndTimeComponent } from './choose-day-and-time/choose-day-and-time.component';
import { RedirectLoginComponent } from './redirect-login/redirect-login.component';
import { ConfirmReservationComponent } from './confirm-reservation/confirm-reservation.component';

@NgModule({
  declarations: [BookingComponent, ChooseServicesComponent, ChooseDayAndTimeComponent, RedirectLoginComponent, ConfirmReservationComponent],
  imports: [CommonModule, BookingRoutingModule, NgIconsModule],
})
export class BookingModule {}
