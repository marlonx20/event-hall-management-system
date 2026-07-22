export interface QuickMessage {
  id: number;
  venue_id: number;
  title: string;
  content: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuickMessageCreate {
  title: string;
  content: string;
  display_order: number;
}

export interface QuickMessageUpdate {
  title?: string;
  content?: string;
  display_order?: number;
}