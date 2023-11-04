import { useEffect, useState, useRef } from "react";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/spray-text.module.scss";

function SprayText({ text }) {
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

  return (
    <div className={styles["spray-text"]}>
      <img
        className={styles.spray}
        key={spray}
        src={`${CDN_URL}/images/misc/spray-${spray}.png`}
        alt=""
      />
      <span>{text}</span>
    </div>
  );
}

export default SprayText;
