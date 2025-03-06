import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { showTransitionAtom } from "@/lib/state";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/transition.module.scss";

function Transition() {
  const videoRef = useRef();
  const [showTransition, setShowTransition] = useAtom(showTransitionAtom);

  useEffect(() => {
    if (!showTransition) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    video.play();

    const timeoutDuration = window.innerWidth <= 500 ? 600 : 500;
    const transitionTimeout = setTimeout(() => {
      setShowTransition(false);
    }, timeoutDuration);

    return () => clearTimeout(transitionTimeout);
  }, [showTransition, setShowTransition]);

  return (
    <div
      className={`${styles.transition} ${showTransition ? styles.show : ""}`}
    >
      <video ref={videoRef} muted playsInline fetchpriority="high">
        <source src={`${CDN_URL}/videos/text-muted-comp.mp4`} />
      </video>
    </div>
  );
}

export default Transition;
