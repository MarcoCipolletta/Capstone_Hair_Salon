export interface iOpeningHour {
  id: string;
  day: string;
  openingTime: number;
  launchBreakStartTime: number;
  launchBreakEndTime: number;
  closingTime: number;
  closed: boolean;
}
