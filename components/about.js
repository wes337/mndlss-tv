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
        <p>
          My passion lies in creating immersive media through guerilla shooting
          techniques, fusing both traditional and contemporary mediums and
          technologies. I disrupt established media norms, nurturing complete
          artistic liberty in both my personal practice and the projects I
          engage with.
        </p>
        <p>I embody this concept through MNDLSS.</p>
      </div>
    </div>
  );
}
