export interface Image {
  _id: string;
  localPath: string;
  url: string;
}

export interface ProductResponse {
  products: Product[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  prevPage: number | null;
  serialNumberStartFrom: number;
  totalProducts: number;
  totalPages: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  owner: string;
  mainImage: Image;
  subImages: Image[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
