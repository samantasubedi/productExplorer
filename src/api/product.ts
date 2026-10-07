import type { AxiosRequestConfig } from "axios";
import type { Product, ProductDetail, ProductsResponse } from "../types/product";
import { apiClient } from "./client";

export const getProducts = async ({
  search,
  limit = 12,
  signal,
}: {
  search?: string;
  limit?: number;
  signal?: AxiosRequestConfig["signal"];
  }): Promise<Product[]> => {
  
  const  q = search?.trim();
  const url = q ? "products/search" : "products";
  const params = q ? { q, limit } : { limit };
  const response = await apiClient.get<ProductsResponse>(url, {
    params,
    signal,
  });
  return response.data.products;
};

export const getProductById = async ({id,signal}:{id:number,signal:AxiosRequestConfig["signal"]}):Promise<ProductDetail> => {
  const response = await apiClient.get<ProductDetail>(`/products/${id}`, { signal })
  return response.data
}