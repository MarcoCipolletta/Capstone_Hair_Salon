export interface iCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    description: string;
  };
  classNames: string[];
}
