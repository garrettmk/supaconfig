export interface PaginationInput<T = any> {
  initialData?: PaginatedResult<T>;
  enabled?: boolean;
  offset?: number;
  limit?: number;
}

export interface PaginatedResult<T = any> {
  data: T[];
  count: number;
  offset: number;
  limit: number;
}