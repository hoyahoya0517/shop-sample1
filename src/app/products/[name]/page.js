import { addCart, getProduct, me } from "@/server/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Product from "../_components/product/product";

export default async function Page({ params }) {
  const user = await me();
  const name = decodeURI(params.name);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products", name],
    queryFn: () => getProduct(name),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Product name={name} user={user} />
      </HydrationBoundary>
    </div>
  );
}
