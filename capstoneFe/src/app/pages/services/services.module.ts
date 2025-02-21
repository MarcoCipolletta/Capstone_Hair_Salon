import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
  declarations: [ServicesComponent],
  imports: [CommonModule, ServicesRoutingModule, PipesModule],
})
export class ServicesModule {}
