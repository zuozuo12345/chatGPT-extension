export interface LISTING_DATA_TYPE {
  name: string;
  value: string;
}

export interface LOCATION_DATA_TYPE {
  name: string;
  value: string;
}

export interface SKILL_BY_ID_DATA_TYPE {
  updated_at: string;
  is_deleted: boolean;
  id: string;
  slug: string;
  created_at: string;
  deleted_at: string;
  name: string;
  description: string;
}

export interface NORMALISED_LISTING_DATA_TYPE {
  [listingId: string]: LISTING_DATA_TYPE;
}

export interface NORMALISED_SKILL_DATA_TYPE {
  [skillId: string]: SKILL_BY_ID_DATA_TYPE;
}
