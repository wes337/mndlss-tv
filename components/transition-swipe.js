import { useEffect } from "react";
import { useAtom } from "jotai";
import { showTransitionSwipeAtom } from "@/lib/state";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/transition-swipe.module.scss";

function TransitionSwipe() {
  const [showTransitionSwipe, setShowTransitionSwipe] = useAtom(
    showTransitionSwipeAtom
  );

  useEffect(() => {
    if (!showTransitionSwipe) {
      return;
    }

    const transitionTimeout = setTimeout(() => {
      setShowTransitionSwipe(false);
    }, 2000);

    return () => clearTimeout(transitionTimeout);
  }, [showTransitionSwipe, setShowTransitionSwipe]);

  return (
    <img
      className={`${styles["transition-swipe"]} ${
        showTransitionSwipe ? styles.show : ""
      }`}
      src={`${CDN_URL}/images/misc/mob-comp.png`}
      alt=""
    />
  );
}

export default TransitionSwipe;
