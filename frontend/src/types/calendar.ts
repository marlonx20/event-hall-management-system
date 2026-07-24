import type { CalendarActivity } from "./calendarActivity";

export interface CalendarDay {
  date: string;
  activities: CalendarActivity[];
  isCurrentMonth: boolean;
  isToday: boolean;
}