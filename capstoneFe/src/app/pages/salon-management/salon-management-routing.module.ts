import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonManagementComponent } from './salon-management.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ServicesComponent } from './services/services.component';
import { CustomersComponent } from './customers/customers.component';
import { InfoCustomerComponent } from './info-customer/info-customer.component';
import { AddHolidaysComponent } from './add-holidays/add-holidays.component';
import { AdminGuard } from '../../auth/guards/admin.guard';

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
        canActivate: [AdminGuard],
      },
      {
        path: 'closingManagement',
        component: AddHolidaysComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'openingHours',
        component: OpeningHoursComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'services',
        component: ServicesComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'customers/:id',
        component: InfoCustomerComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalonManagementRoutingModule {}
