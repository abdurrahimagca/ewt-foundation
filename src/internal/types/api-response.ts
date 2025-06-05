export type ApiResponse<T> = {
  status: number;
  timestamp: string;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  status: number;
  timestamp: string;
  error: string;
  details: Record<string, string[]>;
};
