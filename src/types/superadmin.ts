export interface Superadmin {
  id: number;
  created_at: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_by: string | null;
  last_login: string | null;
}

export interface SuperadminWithCreator extends Superadmin {
  creator_name: string | null;
  creator_email: string | null;
}

export interface CreateSuperadminRequest {
  email: string;
  full_name?: string;
  password?: string;
}

export interface CreateSuperadminResponse {
  user: Superadmin;
  temporary_password: string;
}

export interface SuperadminSession {
  user: Superadmin;
  isAuthenticated: boolean;
}
