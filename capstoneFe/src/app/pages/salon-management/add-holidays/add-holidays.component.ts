import { Component, inject } from '@angular/core';
import { iManagerSchedule } from '../../../interfaces/managerSchedule/i-manager-schedule';
import { iCreateManagerSchedule } from '../../../interfaces/managerSchedule/i-manager-schedule-create';
import { start } from '@popperjs/core';
import { ManagerScheduleService } from '../../../services/manager-schedule.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { iResponseStringMessage } from '../../../interfaces/i-response-string-message';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-add-holidays',
  templateUrl: './add-holidays.component.html',
  styleUrl: './add-holidays.component.scss',
})
export class AddHolidaysComponent {
  constructor(
    private managerScheduleSvc: ManagerScheduleService,
    protected timeConversionSvc: TimeConversionSvcService,
    private modalSvc: NgbModal
  ) {}

  allClosing: iManagerSchedule[] = [];
  today = new Date().toISOString().split('T')[0];

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
  closingDay: iCreateManagerSchedule = {
    startDate: new Date().toISOString().split('T')[0],
    reason: '',
  };
  closingHours: iCreateManagerSchedule = {
    startDate: new Date().toISOString().split('T')[0],
    startTime: 0,
    endTime: 0,
    reason: '',
  };
  closingHoursStartTime: string = '';
  closingHoursEndTime: string = '';

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
            this.openModal(res.message);
          });
      }
    } else if (this.closingType === 'closingDay') {
      const date = new Date(this.closingDay.startDate);
      this.managerScheduleSvc
        .createSchedule(this.closingDay)
        .subscribe((res) => {
          this.openModal(res.message);
        });
    } else if (this.closingType === 'blockHours') {
      this.closingHours.startTime = this.timeConversionSvc.timeToSeconds(
        this.closingHoursStartTime.toString()
      );
      this.closingHours.endTime = this.timeConversionSvc.timeToSeconds(
        this.closingHoursEndTime.toString()
      );
      this.managerScheduleSvc
        .createSchedule(this.closingHours)
        .subscribe((res) => {
          this.openModal(res.message);
        });
    }
  }
  getClosing() {
    if (this.closingType === 'allClosing') return;
    this.managerScheduleSvc.managerSchedule$.subscribe((res) => {
      this.allClosing = res;
      console.log(res);
    });
  }

  openModal(mess: string) {
    const modalRef = this.modalSvc.open(ModalComponent, {
      windowClass: 'custom-success-modal',
    });
    modalRef.componentInstance.message = mess;
  }
}
