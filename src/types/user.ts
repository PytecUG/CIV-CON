export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  role?: string;
  region?: string;
  district_id?: string | number;
  occupation?: string;
  bio?: string;
  privacy_level?: "public" | "private";
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}
