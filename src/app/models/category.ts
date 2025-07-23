export interface CategoryResponse {
  categories: Category[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  prevPage: number | null;
  serialNumberStartFrom: number;
  totalCategories: number;
  totalPages: number;
}

export interface Category {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
