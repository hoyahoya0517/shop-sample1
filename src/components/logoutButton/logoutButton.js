"use client";

import { logout } from "@/server/server";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const queryClinet = useQueryClient();
  const router = useRouter();
  const handleClick = () => {
    logout();
    queryClinet.removeQueries({
      queryKey: ["cart"],
    });
    queryClinet.removeQueries({
      queryKey: ["user"],
    });
    router.refresh();
  };
  return <button onClick={handleClick}>로그아웃하기!!!!</button>;
}
