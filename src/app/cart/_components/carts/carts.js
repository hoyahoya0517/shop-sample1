"use client";

import styles from "./carts.module.css";
import { getCart, updateCartQty } from "@/server/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Carts({ user }) {
  const {
    data: carts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(user),
    staleTime: 1000 * 60 * 60,
  });
  const queryClient = useQueryClient();
  const updateQtyMutation = useMutation({
    mutationFn: ({ productId, user, number }) =>
      updateCartQty(productId, user, number),
    onSuccess: () => {},
    onError: () => {},
  });
  const handleQtyButton = (productId, user, number) => {
    updateQtyMutation.mutate({ productId, user, number });
  };

  return (
    <div className={styles.carts}>
      {carts &&
        carts.map((product) => (
          <div key={product.id} className={styles.cart}>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <button onClick={handleQtyButton.bind(null, product.id, user, 1)}>
              +
            </button>
            <span>{product.myQty}</span>
            <button onClick={handleQtyButton.bind(null, product.id, user, -1)}>
              -
            </button>
          </div>
        ))}
    </div>
  );
}
