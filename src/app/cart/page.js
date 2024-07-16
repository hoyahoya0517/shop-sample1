import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import styles from "./page.module.css";
import { getCart, me } from "@/server/server";
import Carts from "./_components/carts/carts";

export default async function Page() {
  const user = await me();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(user),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Carts user={user} />
    </HydrationBoundary>
  );
}
