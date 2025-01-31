export interface iManagerSchedule {
  id: string;
  date: Date;
  startTime: number;
  endTime: number;
  typeSchedule: string;
  reason?: string;
}
