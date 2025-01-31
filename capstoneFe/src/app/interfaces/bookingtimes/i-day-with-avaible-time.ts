import { iManagerSchedule } from '../managerSchedule/i-manager-schedule';
import { iAvailableTime } from './i-available-time';

export interface iDayWithAvaibleTime {
  date: Date;
  dayName: string;
  dayNumber: string;
  availableTimes: iAvailableTime[];
  isAvailable: boolean;
  managerSchedules: iManagerSchedule[];
}
