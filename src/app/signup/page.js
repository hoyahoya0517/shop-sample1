"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useFormState } from "react-dom";
import { signup } from "@/server/server";

export default function Page() {
  const [state, formAction] = useFormState(signup, {});
  return (
    <div>
      <form className={styles.login} action={formAction}>
        <span>name</span>
        <input name="name" />
        <span>phone</span>
        <input name="phone" />
        <input name="email" />
        <input name="password" />
        <button type="submit">회원가입</button>
        {state && <p>{state.errorMessage}</p>}
      </form>
      {state && <p>{state.successMessage}</p>}
      <Link href="/login">로그인하러가기</Link>
    </div>
  );
}
