import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/bump.module.scss";

function Bump() {
  return (
    <div id="bumps" className={styles.bump}>
      <video muted playsInline loop autoPlay>
        <source src={`${CDN_URL}/videos/long-bump-comp.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}

export default Bump;
