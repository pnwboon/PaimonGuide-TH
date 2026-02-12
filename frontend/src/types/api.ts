// =============================================
// PaimonGuide TH - API Response Types
// =============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  error: string | null;
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  element?: string;
  weapon_type?: string;
  rarity?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  type: 'character' | 'weapon' | 'artifact';
  id: string;
  slug: string;
  name_en: string;
  name_th: string;
  icon_url?: string;
  rarity?: number;
}
