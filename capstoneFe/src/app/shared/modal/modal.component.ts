import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  @Input() message!: string;
  ngOnInit() {
    setTimeout(() => {
      this.activeModal.close();
    }, 1200);
  }
}
