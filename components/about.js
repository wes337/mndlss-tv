import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/about.module.scss";

export default function About() {
  return (
    <div className={styles.about}>
      <video className={styles["about-photo"]} autoPlay loop muted playsInline>
        <source src={`${CDN_URL}/videos/me.mp4`} type="video/mp4" />
      </video>
      <div className={styles["about-info"]}>
        <p className={styles["about-quote"]}>
          <span>MNDLSS</span> is the alias of American filmmaker{" "}
          <em>Alex Luke</em>.
        </p>
        <p className={styles.footer}>
          <a
            href="https://www.instagram.com/mndlss"
            target="_blank"
            rel="noopener noreferrer"
          >
            Not for everyone.
          </a>
        </p>
      </div>
    </div>
  );
}
