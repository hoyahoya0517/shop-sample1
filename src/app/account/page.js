import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import styles from "./page.module.css";
import { getUserInfo, me } from "@/server/server";
import UserInfo from "./_components/userInfo";

export default async function Page() {
  const user = await me();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(user),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserInfo user={user} />
    </HydrationBoundary>
  );
}
