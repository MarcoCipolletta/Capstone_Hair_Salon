import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { MyReservationComponent } from './my-reservation/my-reservation.component';
import { UserGuard } from '../../auth/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
  {
    path: 'myReservations',
    component: MyReservationComponent,
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
