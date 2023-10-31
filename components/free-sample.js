import { useState, useEffect } from "react";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/free-sample.module.scss";

export default function FreeSample() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const alreadySignedUp = sessionStorage.getItem("mndlss-signed-up");
      if (alreadySignedUp) {
        return;
      }

      setShow(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!show || loading) {
        return;
      }

      setLoading(true);

      const response = await fetch("/api/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: input }),
      });

      if (response.status === 204) {
        setShow(false);
        sessionStorage.setItem("mndlss-signed-up", "true");
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className={styles["free-sample"]}>
        <button className={styles.close} onClick={() => setShow(false)}>
          <img src={`${CDN_URL}/images/misc/close.png`} alt="Close" />
        </button>
        <div className={styles.label}>
          Sign up and get a <em>FREE SAMPLE</em> asset pack!
        </div>
        <div className={styles["sub-label"]}>
          (We will <strong>never</strong> send you spam or share your email
          address)
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            onChange={(event) => setInput(event.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className={styles.backdrop} onClick={() => setShow(false)} />
    </>
  );
}
