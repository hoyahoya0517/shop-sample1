"use client";

import styles from "./userInfo.module.css";
import { getUserInfo, updateUserInfo } from "@/server/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function UserInfo({ user }) {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(user),
    staleTime: 1000 * 60 * 60,
  });
  const updateUserMutation = useMutation({
    mutationFn: ({ updateUser, oldPassword, newPassword }) =>
      updateUserInfo(updateUser, oldPassword, newPassword),
    onSuccess: () => {},
    onError: () => {},
  });
  const [name, setName] = useState(userInfo?.name || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleOnChnageName = (e) => {
    setName(e.target.value);
  };
  const handleOnChangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnChangeOldPassword = (e) => {
    setOldPassword(e.target.value);
  };
  const handleOnChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleForm = (e) => {
    e.preventDefault();
    const updateUser = { ...userInfo, name, phone };
    updateUserMutation.mutate({ updateUser, oldPassword, newPassword });
  };
  useEffect(() => {
    setName(userInfo?.name || "");
    setPhone(userInfo?.phone || "");
    setEmail(userInfo?.email || "");
  }, [user, userInfo]);
  return (
    <div>
      <form onSubmit={handleForm} className={styles.userInfo}>
        <input name="name" value={name} onChange={handleOnChnageName} />
        <input name="phone" value={phone} onChange={handleOnChangePhone} />
        <input name="email" value={email} readOnly />
        <input
          name="password"
          type="password"
          value={oldPassword}
          autoComplete="false"
          onChange={handleOnChangeOldPassword}
        />
        <input
          name="password"
          type="password"
          value={newPassword}
          autoComplete="false"
          onChange={handleOnChangeNewPassword}
        />
        <button type="submit">update</button>
      </form>
    </div>
  );
}
