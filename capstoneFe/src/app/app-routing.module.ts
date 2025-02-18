import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './auth/guards/logged.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { UserGuard } from './auth/guards/user.guard';
import { NotAdminGuard } from './auth/guards/not-admin.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'booking',
    loadChildren: () =>
      import('./pages/booking/booking.module').then((m) => m.BookingModule),
    canActivate: [NotAdminGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [LoggedGuard],
  },
  {
    path: 'salonManagement',
    loadChildren: () =>
      import('./pages/salon-management/salon-management.module').then(
        (m) => m.SalonManagementModule
      ),
    canActivate: [LoggedGuard, AdminGuard],
  },
  { path: 'contacts', loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
