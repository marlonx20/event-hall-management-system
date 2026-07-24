import type { ReservationStatus } from "./reservation";
import type { TaskStatus } from "./task";

export type CalendarActivityType =
  | "reservation"
  | "task";

export interface CalendarActivityBase {
  key: string;
  id: number;
  type: CalendarActivityType;
  date: string;
  title: string;
  subtitle: string | null;
  time: string | null;
}

export interface ReservationCalendarActivity
  extends CalendarActivityBase {
  type: "reservation";
  status: ReservationStatus;
  customerName: string;
}

export interface TaskCalendarActivity
  extends CalendarActivityBase {
  type: "task";
  status: TaskStatus;
  assignedTo: string | null;
}

export type CalendarActivity =
  | ReservationCalendarActivity
  | TaskCalendarActivity;