import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonManagementComponent } from './salon-management.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ServicesComponent } from './services/services.component';
import { CustomersComponent } from './customers/customers.component';
import { InfoCustomerComponent } from './info-customer/info-customer.component';
import { AddHolidaysComponent } from './add-holidays/add-holidays.component';

const routes: Routes = [
  {
    path: '',
    component: SalonManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'appointments',
        pathMatch: 'full',
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'closingManagement',
        component: AddHolidaysComponent,
      },
      {
        path: 'openingHours',
        component: OpeningHoursComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customers/:id',
        component: InfoCustomerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalonManagementRoutingModule {}
