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
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AddHolidaysComponent } from './add-holidays/add-holidays.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCollapseModule,
  NgbPaginationModule,
  NgbScrollSpyModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AllClosingCardComponent } from './all-closing-card/all-closing-card.component';
import { CardOpeningHourComponent } from './card-opening-hour/card-opening-hour.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { CustomerCardComponent } from './customer-card/customer-card.component';
import { InfoCustomerComponent } from './info-customer/info-customer.component';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { AdminGalleryComponent } from './gallery/admin-gallery.component';

@NgModule({
  declarations: [
    SalonManagementComponent,
    AppointmentsComponent,
    OpeningHoursComponent,
    ServicesComponent,
    CustomersComponent,
    CalendarComponent,
    AppointmentsListComponent,
    AddHolidaysComponent,
    AllClosingCardComponent,
    CardOpeningHourComponent,
    ServiceCardComponent,
    CreateServiceComponent,
    CustomerCardComponent,
    InfoCustomerComponent,
    CreateReservationComponent,
    ReservationHistoryComponent,
    AdminGalleryComponent,
  ],
  imports: [
    CommonModule,
    SalonManagementRoutingModule,
    NgIcon,
    FullCalendarModule,
    FormsModule,
    NgbCollapseModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgSelectModule,
    PipesModule,
  ],
})
export class SalonManagementModule {}
