import { useEffect, useState } from "react";
import { CDN_URL } from "@/lib/constants";
import { eventTargetInsideElementTag } from "@/lib/utils";
import styles from "@/styles/cursor.module.scss";

export default function Cursor() {
  const [hide, setHide] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    const onMouseMove = (event) => {
      setPositionX(event.clientX);
      setPositionY(event.clientY);

      const hide = eventTargetInsideElementTag(event);
      setHide(hide);
    };

    document.addEventListener("pointermove", onMouseMove);

    return () => [document.removeEventListener("pointermove", onMouseMove)];
  }, []);

  return (
    <img
      className={styles.cursor}
      src={`${CDN_URL}/images/misc/cursor.png`}
      alt=""
      style={{
        opacity: hide ? 0 : 1,
        left: `${positionX}px`,
        top: `${positionY}px`,
      }}
    />
  );
}
