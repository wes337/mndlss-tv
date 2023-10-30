import NavLink from "@/components/nav-link";
import styles from "@/styles/nav.module.scss";

function Nav() {
  return (
    <div className={styles.nav}>
      <NavLink label="Work" to="/work" img="face" />
      <NavLink label="Contact" to="/contact" img="skull" />
      <NavLink label="Shop" to="/shop" img="brain" />
    </div>
  );
}

export default Nav;
