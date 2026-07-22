export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "finished"
  | "cancelled";

export interface ReservationCreate {
  customer_id: number;
  event_date: string;
  start_time: string;
  end_time: string | null;
  event_type: string | null;
  guest_count: number | null;
  has_bouncy_castle: boolean;
  status: ReservationStatus;
  special_requirements: string | null;
  internal_notes: string | null;
}

export interface ReservationUpdate {
  customer_id?: number;
  event_date?: string;
  start_time?: string;
  end_time?: string | null;
  event_type?: string | null;
  guest_count?: number | null;
  has_bouncy_castle?: boolean;
  special_requirements?: string | null;
  internal_notes?: string | null;

  extra_hours?: number | null;
  damage_description?: string | null;
  damage_charge?: number | null;
}
export interface ReservationFinish {
  final_comments: string | null;
}
export interface Reservation {
  id: number;
  venue_id: number;
  customer_id: number;
  event_date: string;
  start_time: string;
  end_time: string | null;
  event_type: string | null;
  guest_count: number | null;
  has_bouncy_castle: boolean;
  status: ReservationStatus;
  special_requirements: string | null;
  internal_notes: string | null;
  total_price: string;
  final_comments: string | null;
  extra_hours: string | null;
  extra_charge: string | null;
  damage_description: string | null;
  damage_charge: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  amount_paid: string;
  remaining_balance: string;
}