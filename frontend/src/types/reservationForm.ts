import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface ReservationFormData {
  customerId: number | null;

  eventDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;

  eventType: string;
  guestCount: number | null;
  hasBouncyCastle: boolean | null;

  specialRequirements: string;
  internalNotes: string;

  depositAmount: number;
  paymentMethod: "" | "cash" | "transfer";
  paymentDate: Dayjs | null;
  paymentReference: string;
}

export const initialReservationFormData: ReservationFormData = {
  customerId: null,

  eventDate: dayjs(),
  startTime: null,
  endTime: null,

  eventType: "",
  guestCount: null,
  hasBouncyCastle: null,

  specialRequirements: "",
  internalNotes: "",

  depositAmount: 0,
  paymentMethod: "",
  paymentDate: null,
  paymentReference: "",
};