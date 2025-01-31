import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeConversionSvcService {
  constructor() {}

  ngOnInist() {}
  secondsToTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds - hours * 3600) / 60;
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  }
  secondsToDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds - hours * 3600) / 60;
    const hoursInString =
      hours === 0 ? '' : hours === 1 ? `${hours} ora ` : `${hours} ore `;
    const minutesInString = minutes === 0 ? '' : minutes.toFixed(0) + ' min';
    return `${hoursInString}${minutesInString}`;
  }
  timeToSeconds(time: string) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  }
}
