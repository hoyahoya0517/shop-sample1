import Link from "next/link";
import styles from "./nav.module.css";
import { me, me2 } from "@/server/server";
import LogoutButton from "../logoutButton/logoutButton";

export default async function Nav() {
  const user = await me();
  return (
    <div className={styles.nav}>
      <Link href="/">home</Link>
      <Link href="/products">products</Link>
      <Link href="/cart">{`cart(${
        user?.cart?.length > 0 ? user.cart.length : 0
      })`}</Link>
      {!user && <Link href="/login">login</Link>}
      {user && <Link href="/account">account</Link>}
      {user && <LogoutButton />}
    </div>
  );
}
