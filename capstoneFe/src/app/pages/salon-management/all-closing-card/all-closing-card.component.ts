import { Component, inject, Input } from '@angular/core';
import { iManagerSchedule } from '../../../interfaces/managerSchedule/i-manager-schedule';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { ManagerScheduleService } from '../../../services/manager-schedule.service';

@Component({
  selector: 'app-all-closing-card',
  templateUrl: './all-closing-card.component.html',
  styleUrl: './all-closing-card.component.scss',
})
export class AllClosingCardComponent {
  protected timeConversionSvc = inject(TimeConversionSvcService);
  private managerScheduleSvc = inject(ManagerScheduleService);
  @Input() schedule!: iManagerSchedule;

  cancelSchedule(id: string) {
    this.managerScheduleSvc.deleteSchedule(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
