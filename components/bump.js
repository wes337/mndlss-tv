import { useEffect, useState } from "react";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/bump.module.scss";

const BUMPS = [
  `${CDN_URL}/videos/bump-1-comp-muted.mp4`,
  `${CDN_URL}/videos/static-5-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-2-comp-muted.mp4`,
  `${CDN_URL}/videos/static-6-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-3-comp-muted.mp4`,
  `${CDN_URL}/videos/static-7-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-4-comp-muted.mp4`,
  `${CDN_URL}/videos/static-8-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-5-comp-muted.mp4`,
  `${CDN_URL}/videos/static-9-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-6-comp-muted.mp4`,
  `${CDN_URL}/videos/static-10-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-7-comp-muted.mp4`,
  `${CDN_URL}/videos/static-11-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-8-comp-muted.mp4`,
  `${CDN_URL}/videos/static-12-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-9-comp-muted.mp4`,
  `${CDN_URL}/videos/static-3-comp-muted.mp4`,
  `${CDN_URL}/videos/bump-10-comp-muted.mp4`,
  `${CDN_URL}/videos/static-4-comp-muted.mp4`,
];

function Bump() {
  const [currentBump, setCurrentBump] = useState(0);

  const playNextBump = () => {
    setCurrentBump((currentBump) => {
      const nextBump = currentBump + 1;
      return nextBump > BUMPS.length - 1 ? 1 : nextBump;
    });
  };

  useEffect(() => {
    const bumps = document.querySelector("#bumps");

    const previousBumpVideos = bumps.querySelectorAll("video");
    previousBumpVideos.forEach((video) => {
      video.remove();
    });

    const bumpVideo = document.createElement("video");

    bumpVideo.src = BUMPS[currentBump];
    bumpVideo.onended = playNextBump;
    bumpVideo.volume = 0;
    bumpVideo.muted = true;
    bumpVideo.playsInline = true;
    bumpVideo.play().catch(() => {
      // Do nothing
    });

    bumps.appendChild(bumpVideo);

    return () => {
      bumpVideo.remove();
    };
  }, [currentBump]);

  return <div id="bumps" className={styles.bump} />;
}

export default Bump;
