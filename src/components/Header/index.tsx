import styles from "./styles.module.scss";
import { SignInButton } from "../SignIn/index";
import Link from "next/link";
import { ActiveLink } from "../ActiveLink";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a className={styles.active}>Home</a>
          </ActiveLink>
          {/* prefetch -> Quando terminar de carregar toda minha aplicação, o next
            por baixo dos panos, deixou a página pré carregada para mim.
          */}
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
