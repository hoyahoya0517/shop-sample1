"use client";

import styles from "./products.module.css";
import { getProducts } from "@/server/server";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Products() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 60,
  });
  return (
    <div className={styles.products}>
      {products &&
        products.map((product) => (
          <div key={product.id}>
            <Link href={`/products/${encodeURI(product.name)}`}>
              {product.name}
            </Link>
            <span>{product.price}</span>
          </div>
        ))}
    </div>
  );
}
