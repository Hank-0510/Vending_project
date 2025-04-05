// Product related interfaces

// Base product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  machine_id?: number;
  status?: 'available' | 'unavailable';
  selected?: boolean; // Used for UI selection state
}

// Response interfaces
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// Product list response
export interface ProductListResponse {
  data: Product[];
  status: string;
}