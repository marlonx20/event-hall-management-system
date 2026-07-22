export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "finished"
  | "cancelled";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface DashboardReservation {
  id: number;
  customer_name: string;
  event_date: string;
  start_time: string;
  event_type: string | null;
  status: ReservationStatus;
  remaining_balance: string;
}

export interface DashboardTask {
  id: number;
  title: string;
  due_date: string;
  assigned_to: string | null;
  status: TaskStatus;
}

export interface DashboardData {
  today_events: DashboardReservation[];
  today_tasks: DashboardTask[];
  upcoming_events: DashboardReservation[];
  upcoming_tasks: DashboardTask[];
  pending_reservations: DashboardReservation[];
  today_pending_payments: DashboardReservation[];
  monthly_income: string;
}