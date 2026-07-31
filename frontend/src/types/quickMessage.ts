export interface QuickMessage {
  id: number;
  venue_id: number;
  title: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickMessageCreate {
  title: string;
  content: string;
  is_favorite: boolean;
}

export interface QuickMessageUpdate {
  title?: string;
  content?: string;
  is_favorite?: boolean;
}