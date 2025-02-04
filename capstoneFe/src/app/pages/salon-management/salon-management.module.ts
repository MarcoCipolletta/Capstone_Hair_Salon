import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalonManagementRoutingModule } from './salon-management-routing.module';
import { SalonManagementComponent } from './salon-management.component';
import { NgIcon } from '@ng-icons/core';
import { AppointmentsComponent } from './appointments/appointments.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ServicesComponent } from './services/services.component';
import { CustomersComponent } from './customers/customers.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [
    SalonManagementComponent,
    AppointmentsComponent,
    OpeningHoursComponent,
    ServicesComponent,
    CustomersComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    SalonManagementRoutingModule,
    NgIcon,
    FullCalendarModule,
  ],
})
export class SalonManagementModule {}
