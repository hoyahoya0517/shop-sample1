"use client";

import styles from "./product.module.css";
import { addCart, getProduct } from "@/server/server";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Product({ name, user }) {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", name],
    queryFn: () => getProduct(name),
    staleTime: 1000 * 60 * 60,
  });
  const [addCartisError, setAddCartIsError] = useState(false);
  const [error, setError] = useState();
  const handleClick = () => {
    if (!user) setError("로그인을 하세요");
    addCart(product.id, user);
  };
  return (
    <div className={styles.product}>
      <span>{product?.name}</span>
      <button onClick={handleClick}>add cart</button>
      {error && <p>{error}</p>}
    </div>
  );
}
