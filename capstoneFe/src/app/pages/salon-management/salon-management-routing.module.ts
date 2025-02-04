import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonManagementComponent } from './salon-management.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ServicesComponent } from './services/services.component';
import { CustomersComponent } from './customers/customers.component';

const routes: Routes = [
  {
    path: '',
    component: SalonManagementComponent,
    children: [
      {
        path: 'appointments',
        component: AppointmentsComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalonManagementRoutingModule {}
