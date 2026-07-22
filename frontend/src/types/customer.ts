export interface Customer {
  id: number;
  full_name: string;
  phone_number: string | null;
  preferred_contact_method: string;
  messenger_user_name: string | null;
  notes: string | null;
}

export interface CustomerCreate {
  full_name: string;
  phone_number: string | null;
  preferred_contact_method: string;
  messenger_user_name: string | null;
  notes: string | null;
}