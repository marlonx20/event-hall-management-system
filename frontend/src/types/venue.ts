export interface Venue {
  id: number;

  name: string;
  address: string | null;
  phone: string | null;
  capacity: number;

  opening_time: string | null;
  closing_time: string | null;

  facebook_url: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  website_url: string | null;

  base_price: string;
  bouncy_castle_cost: string;
  extra_hour_price: string;

  bank_name: string | null;
  bank_account_holder: string | null;
  bank_account_number: string | null;
  bank_clabe: string | null;

  facebook_response_message: string | null;
  banking_information_message: string | null;
  location_message: string | null;
  venue_rules_message: string | null;
  payment_reminder_message: string | null;
  thank_you_message: string | null;
  general_notes: string | null;
}

export interface VenueUpdate {
  name: string;
  address: string | null;
  phone: string | null;
  capacity: number;

  opening_time: string | null;
  closing_time: string | null;

  facebook_url: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  website_url: string | null;

  base_price: number;
  bouncy_castle_cost: number;
  extra_hour_price: number;

  bank_name: string | null;
  bank_account_holder: string | null;
  bank_account_number: string | null;
  bank_clabe: string | null;

  facebook_response_message: string | null;
  banking_information_message: string | null;
  location_message: string | null;
  venue_rules_message: string | null;
  payment_reminder_message: string | null;
  thank_you_message: string | null;
  general_notes: string | null;
}