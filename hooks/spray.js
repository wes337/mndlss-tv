import { useRef, useState, useEffect } from "react";

export default function useSpray() {
  const sprayInterval = useRef();
  const [spray, setSpray] = useState(1);

  const startSprayInterval = () => {
    clearInterval(sprayInterval.current);

    sprayInterval.current = setInterval(() => {
      setSpray((spray) => {
        const nextSpray = spray + 1;
        return nextSpray > 6 ? 1 : nextSpray;
      });
    }, 200);
  };

  const stopSprayInterval = () => {
    clearInterval(sprayInterval.current);
  };

  useEffect(() => {
    return () => {
      clearInterval(sprayInterval.current);
    };
  }, []);

  return {
    spray,
    startSprayInterval,
    stopSprayInterval,
  };
}
