import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';

@NgModule({
  declarations: [HomeComponent, OpeningHoursComponent],
  imports: [CommonModule, HomeRoutingModule, PipesModule],
})
export class HomeModule {}
