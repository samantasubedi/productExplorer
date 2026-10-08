import { useCallback, useEffect, useState } from "react";
import { getCategory, getProductById, getProducts } from "../api/product";
import type { Category, Product, ProductDetail } from "../types/product";
import axios from "axios";

export const useProducts = ({
  search,
  category,
  sortBy,
  order,
  skip,
  limit,
}: {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  skip?: number;
  limit?: number;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { products, total } = await getProducts({
          category,
          search,
          sortBy,
          order,
          skip,
          limit,
          signal: controller.signal,
        });
        if (active) {
          setProducts(products);
          setTotal(total);
        }
      } catch (err: unknown) {
        if (!active || axios.isCancel(err)) return;
        setError(
          err instanceof Error ? err.message : "Couldn't fetch products",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [category, search, retryKey, sortBy, order, skip, limit]);
  return { products, loading, error, retry, total };
};

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((k) => k + 1), []);
  const isInvalidId = id === null || Number.isNaN(id);

  useEffect(() => {
    if (id === null || Number.isNaN(id)) return;
    const controller = new AbortController();
    let active = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById({ id, signal: controller.signal });
        if (active) setProduct(data);
      } catch (err: unknown) {
        if (!active || axios.isCancel(err)) return;
        setError(
          err instanceof Error ? err.message : "Couldn't fetch products",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retryKey, isInvalidId]);
  if (isInvalidId) {
    return { product: null, loading: false, error: "Product not found", retry };
  }

  return { product, loading, error, retry };
}
export const useCategory = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategory({ signal: controller.signal });
        if (active) setCategories(data);
      } catch (err: unknown) {
        if (!active || axios.isCancel(err)) return;
        if (active)
          setError(
            err instanceof Error ? err.message : "Couldn't fetch categories",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCategory();
    return () => {
      active = false;
      controller.abort();
    };
  }, [retryKey]);
  return { loading, error, categories, retry };
};
