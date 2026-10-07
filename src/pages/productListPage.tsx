import axios from "axios";
import React, { useEffect, useState } from "react";
import { ProductCard, type Product } from "../components/productCard";
import {ProductListSkeleton} from "../components/loadingSkeleton";

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products", {
          params: { limit: 10 },
          signal: controller.signal,
        });
        setProducts(response.data.products);
        console.log(response.data.products, "this is response");
      } catch (err) {
        if (!axios.isCancel(err)) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("couldn't fetch products");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);
  if (loading) {
    return <ProductListSkeleton count={10} />;
  }
  if (error) {
    return <div>error</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};
