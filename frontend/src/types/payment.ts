export type PaymentMethod =
  | "cash"
  | "transfer";

export type PaymentConcept =
  | "deposit"
  | "final_payment"
  | "extra_hours"
  | "damages";

export interface PaymentCreate {
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  concept: PaymentConcept;
  reference: string | null;
}

export interface Payment extends PaymentCreate {
  id: number;
  reservation_id: number;
}