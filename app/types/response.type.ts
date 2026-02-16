export interface Paging {
  page: number;
  size: number;
  total_item: number;
  total_page: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  paging?: Paging;
  error?: any;
}
