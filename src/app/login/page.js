"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useFormState } from "react-dom";
import { login } from "@/server/server";

export default function Page() {
  const [state, formAction] = useFormState(login, {});
  return (
    <div>
      <form className={styles.login} action={formAction}>
        <input name="email" />
        <input name="password" />
        <button>로그인</button>
        {state && <p>{state.errorMessage}</p>}
      </form>
      <Link href="/signup">회원가입하러가기</Link>
    </div>
  );
}
