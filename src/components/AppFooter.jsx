import styles from "./AppFooter.module.css";
function AppFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; Copywright {new Date().getFullYear()}
      </p>
    </footer>
  );
}

export default AppFooter;
