import styles from "./styles.module.scss";
import { SignInButton } from "../SignIn/index";
import Link from "next/link";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <Link href="/">
            <a className={styles.active}>Home</a>
          </Link>
          {/* prefetch -> Quando terminar de carregar toda minha aplicação, o next
            por baixo dos panos, deixou a página pré carregada para mim.
          */}
          <Link href="/posts" prefetch>
            <a>Posts</a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
