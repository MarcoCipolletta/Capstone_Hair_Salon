import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent as ModalComponent } from './modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule],
  exports: [ModalComponent],
})
export class ErrorModalModule {}
