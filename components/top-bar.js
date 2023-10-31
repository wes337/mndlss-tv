import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { CDN_URL } from "@/lib/constants";
import {
  lightModeAtom,
  altModeAtom,
  showTransitionAtom,
  productPreviewAtom,
} from "@/lib/state";
import styles from "@/styles/top-bar.module.scss";

function TopBar() {
  const router = useRouter();
  const [, setShowTransition] = useAtom(showTransitionAtom);
  const [, setProductPreview] = useAtom(productPreviewAtom);
  const [lightMode] = useAtom(lightModeAtom);
  const [altMode] = useAtom(altModeAtom);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const animateInterval = setInterval(() => {
      setAnimate((animate) => !animate);
    }, 500);

    return () => {
      clearInterval(animateInterval);
    };
  }, []);

  const onClick = () => {
    if (router.pathname === "/") {
      return;
    }

    setShowTransition(true);

    setTimeout(() => {
      router.push("/");
      setProductPreview(null);
    }, 250);
  };

  return (
    <div
      className={`${styles["top-bar"]} ${lightMode ? styles.light : ""} ${
        altMode ? styles.alt : ""
      }`}
    >
      <div className={styles.logo}>
        <button onClick={onClick}>
          <img
            className={animate ? styles.show : styles.hide}
            src={`${CDN_URL}/images/logo/skull-logo-1.png`}
            alt="MNDLSS"
          />
          <img
            className={animate ? styles.hide : styles.show}
            src={`${CDN_URL}/images/logo/skull-logo-2.png`}
            alt="MNDLSS"
          />
        </button>
      </div>
    </div>
  );
}

export default TopBar;
