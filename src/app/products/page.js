import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import styles from "./page.module.css";
import { getProducts } from "@/server/server";
import Products from "./_components/products/products";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  return (
    <div className={styles.products}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Products />
      </HydrationBoundary>
    </div>
  );
}
