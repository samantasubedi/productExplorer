import { useCallback, useEffect, useState } from "react";
import { getProductById, getProducts } from "../api/product";
import type { Product, ProductDetail } from "../types/product";
import axios from "axios";

export const useProducts = ({ search }: { search?: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts({ search, signal: controller.signal });
        if (active) setProducts(data);
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
  }, [search, retryKey]);
  return { products, loading, error, retry };
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
  }, [id, retryKey,isInvalidId]);
  if (isInvalidId) {
    return { product: null, loading: false, error: "Product not found", retry };
  }

  return { product, loading, error, retry };
}
