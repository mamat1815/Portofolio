export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  repo_url: string;
  demo_url: string;
  tags: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  error: string;
}