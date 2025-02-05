import { Component, inject } from '@angular/core';
import { iManagerSchedule } from '../../../interfaces/managerSchedule/i-manager-schedule';
import { iCreateManagerSchedule } from '../../../interfaces/managerSchedule/i-manager-schedule-create';
import { start } from '@popperjs/core';
import { ManagerScheduleService } from '../../../services/manager-schedule.service';

@Component({
  selector: 'app-add-holidays',
  templateUrl: './add-holidays.component.html',
  styleUrl: './add-holidays.component.scss',
})
export class AddHolidaysComponent {
  private managerScheduleSvc = inject(ManagerScheduleService);

  closingType: string = 'holiday';
  holiday: iCreateManagerSchedule = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    })(),
    reason: '',
  };

  addHoliday() {
    if (this.closingType === 'holiday') {
      if (this.holiday.endDate) {
        const startDate = new Date(this.holiday.startDate);
        const endDate = new Date(this.holiday.endDate);

        if (startDate > endDate) {
          alert('La data di fine non può essere prima della data di inizio');
          return;
        }

        this.managerScheduleSvc
          .createSchedule(this.holiday)
          .subscribe((res) => {
            console.log(res);
          });
      }
    }
  }
}
