import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Star } from "lucide-react";
import type { Product } from "../components/productCard";
import { useCartStore } from "../store/cartStore";

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

type ProductDetail = Product & {
  description: string;
  brand?: string;
  images: string[];
  reviews: Review[];
};

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-4 w-4 ${
          n <= Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-400"
        }`}
      />
    ))}
  </div>
);

export const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { addToCart, updateQuantity, items } = useCartStore();
  const existing = items.find((item) => item.product.id === id);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get<ProductDetail>(
          `https://dummyjson.com/products/${id}`,
          { signal: controller.signal },
        );
        setProduct(res.data);
        setSelectedImage(res.data.images[0] ?? res.data.thumbnail);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error || !product)
    return (
      <p className="p-6 text-red-600">{error ?? "Something went wrong"}</p>
    );

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl  bg-gray-100">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {product.images.map((img) => (
              <button
                key={img}
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-100 ${
                  selectedImage === img ? "border-black" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.title} thumbnail`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Stars rating={product.rating} />
            <span>
              {product.rating.toFixed(1)} ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          <p
            className={`text-sm font-medium ${
              outOfStock
                ? "text-red-600"
                : lowStock
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : lowStock
                ? `Only ${product.stock} left`
                : "In stock"}
          </p>

          {existing ? (
            <div className="mt-2 flex w-fit items-center gap-4 rounded-lg  px-2 py-2">
              <button
                onClick={() => updateQuantity(id, existing.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 font-bold text-2xl cursor-pointer items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="min-w-6 text-center font-medium">
                {existing.quantity}
              </span>
              <button
                onClick={() => updateQuantity(id, existing.quantity + 1)}
                disabled={existing.quantity >= product.stock}
                aria-label="Increase quantity"
                className="flex h-8 w-8 font-bold text-2xl cursor-pointer items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              className="mt-2 rounded-lg bg-blue-700 px-6 py-3 text-white transition hover:bg-blue-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {product.reviews.map((review, i) => (
              <li key={i} className="rounded-xl bg-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-700">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <span className="font-medium">{review.reviewerName}</span>
                      <div className="mt-1">
                        <Stars rating={review.rating} />
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
