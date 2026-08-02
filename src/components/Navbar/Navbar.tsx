import styles from "./Navbar.module.scss";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-center"]}>
        <ul className={styles["nav-links"]}>
          <li>
            <a href="/">home</a>
          </li>
          <li>
            <a href="/aboutme">about_me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
