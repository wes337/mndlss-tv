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
          My passion is rooted in crafting immersive media using guerrilla
          shooting techniques, seamlessly blending traditional and contemporary
          mediums and technologies. I challenge conventional media norms,
          fostering an environment of complete artistic freedom in both my
          personal work and the projects I undertake.
        </p>
        <p>I embody this concept through MNDLSS.</p>
      </div>
    </div>
  );
}
