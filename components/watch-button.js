import { useEffect, useState, useRef } from "react";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/watch-button.module.scss";

function WatchButton({ url }) {
  const sprayInterval = useRef();
  const [spray, setSpray] = useState(1);

  useEffect(() => {
    sprayInterval.current = setInterval(() => {
      setSpray((spray) => {
        const nextSpray = spray + 1;
        return nextSpray > 6 ? 1 : nextSpray;
      });
    }, 500);

    return () => {
      clearInterval(sprayInterval.current);
    };
  }, []);

  const onClick = () => {
    window.open(url, "_blank");
  };

  return (
    <button className={styles["watch-button"]} onClick={onClick}>
      <img
        className={styles.spray}
        key={spray}
        src={`${CDN_URL}/images/misc/spray-${spray}.png`}
        alt=""
      />
      <div className={styles.play}>
        <img
          className={styles.main}
          src={`${CDN_URL}/images/misc/play-1.png`}
          alt=""
        />
        <img
          className={styles.alt}
          src={`${CDN_URL}/images/misc/play-2.png`}
          alt=""
        />
      </div>
      <span>Watch</span>
    </button>
  );
}

export default WatchButton;
