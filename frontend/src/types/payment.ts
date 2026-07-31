export type PaymentMethod =
  | "cash"
  | "transfer";

export type PaymentConcept =
  | "deposit"
  | "final_payment"
  | "additional_charges"
  | "extra_hours"
  | "damages";

export interface PaymentCreate {
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  concept: PaymentConcept;
  reference: string | null;
}

export interface Payment
  extends PaymentCreate {
  id: number;
  reservation_id: number;
  receipt_original_name: string | null;
  receipt_content_type: string | null;
  receipt_url: string | null;
}