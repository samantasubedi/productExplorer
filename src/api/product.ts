import type { AxiosRequestConfig } from "axios";
import type {
  Product,
  ProductDetail,
  ProductsResponse,
} from "../types/product";
import { apiClient } from "./client";

export const getProducts = async ({
  search,
  limit = 12,
  category,
  sortBy,
  order,
  signal,
}: {
  search?: string;
  limit?: number;
  category?: string;
  sortBy?: string;
  order?: string;
  signal?: AxiosRequestConfig["signal"];
}): Promise<Product[]> => {
  const q = search?.trim();
  const url = q
    ? "products/search"
    : category
      ? `/products/category/${category}`
      : "products";
  const params :Record<string,string|number>= q ? { q, limit } : { limit };
  if (sortBy && order) {
    params.sortBy = sortBy;
    params.order = order;
  }
  const response = await apiClient.get<ProductsResponse>(url, {
    params,
    signal,
  });
  return response.data.products;
};

export const getProductById = async ({
  id,
  signal,
}: {
  id: number;
  signal: AxiosRequestConfig["signal"];
}): Promise<ProductDetail> => {
  const response = await apiClient.get<ProductDetail>(`/products/${id}`, {
    signal,
  });
  return response.data;
};
export const getCategory = async ({
  signal,
}: {
  signal: AxiosRequestConfig["signal"];
}) => {
  const response = await apiClient.get(`/products/categories`, { signal });
  return response.data;
};
