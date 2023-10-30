import { useState } from "react";
import styles from "@/styles/free-sample.module.scss";

export default function FreeSample() {
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [input, setInput] = useState("");

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      if (signedUp || loading) {
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
        setSignedUp(true);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className={styles["free-sample"]}>
      {signedUp ? (
        <div className={styles["signed-up"]}>Thank you!</div>
      ) : (
        <>
          <div className={styles.label}>
            Sign up and get a <em>FREE SAMPLE</em> asset pack
          </div>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              onChange={(event) => setInput(event.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
}
