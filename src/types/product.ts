export type Product = {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  rating: number;
  discountPercentage: number;
  stock: number;
};
export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type ProductDetail = Product & {
  description: string;
  brand?: string;
  images: string[];
  reviews: Review[];
};
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
export type Category = {
  slug: string;
  name: string;
  url: string;
};
export type SortBy = "price" | "rating";
export type SortOrder = "asc" | "desc";
export type SortValue = "" | `${SortBy}-${SortOrder}`;
