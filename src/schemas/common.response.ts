export type ApiResponse<T> = {
  is_success: boolean;
  official_email: string;
  data: T | null;
  error?: {
    code?: string;
    message: string;
  };
};
