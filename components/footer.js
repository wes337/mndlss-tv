import { useAtom } from "jotai";
import { lightModeAtom } from "@/lib/state";
import Nav from "@/components/nav";
import styles from "@/styles/footer.module.scss";

export default function Footer() {
  const [lightMode] = useAtom(lightModeAtom);

  return (
    <div className={`${styles.footer} ${lightMode ? styles.light : ""}`}>
      <Nav />
      <div className={styles.copyright}>© MNDLSS Pictures 2024</div>
    </div>
  );
}
