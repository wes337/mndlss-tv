import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { CDN_URL } from "@/lib/constants";
import {
  showTransitionAtom,
  showTransitionSwipeAtom,
  lightModeAtom,
  altModeAtom,
} from "@/lib/state";
import useSpray from "@/hooks/spray";
import styles from "@/styles/nav-link.module.scss";

function NavLink({ to, img, label }) {
  const router = useRouter();
  const [, setShowTransition] = useAtom(showTransitionAtom);
  const [, setShowTransitionSwipe] = useAtom(showTransitionSwipeAtom);
  const [lightMode] = useAtom(lightModeAtom);
  const [altMode] = useAtom(altModeAtom);
  const { spray, startSprayInterval, stopSprayInterval } = useSpray();

  const isActive = router.pathname === to;

  useEffect(() => {
    if (isActive) {
      startSprayInterval();
    }
  }, [isActive, startSprayInterval]);

  const onClick = () => {
    if (isActive) {
      return;
    }

    if (to === "/shop") {
      setShowTransitionSwipe(true);
    } else {
      setShowTransition(true);
    }
    setTimeout(() => router.push(to), to === "/shop" ? 500 : 250);
  };

  const onPointerEnter = () => {
    if (isActive) {
      return;
    }

    startSprayInterval();
  };

  const onPointerLeave = () => {
    if (isActive) {
      return;
    }

    stopSprayInterval();
  };

  return (
    <button
      className={`${styles["nav-link"]} ${isActive ? styles.active : ""} ${
        lightMode ? styles.light : ""
      } ${altMode ? styles.alt : ""}`}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <img
        className={styles.spray}
        key={spray}
        src={`${CDN_URL}/images/misc/spray-${spray}.png`}
        alt=""
      />
      <div className={styles["nav-link-icon"]}>
        <img
          className={styles.main}
          src={`${CDN_URL}/images/nav/${img}-1.png`}
          alt=""
        />
        <img
          className={styles.alt}
          src={`${CDN_URL}/images/nav/${img}-2.png`}
          alt=""
        />
      </div>
      <span>{label}</span>
    </button>
  );
}

export default NavLink;
