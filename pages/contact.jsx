import { useEffect } from "react";
import Head from "next/head";
import { useAtom } from "jotai";
import { lightModeAtom } from "@/lib/state";
import About from "@/components/about";
import styles from "@/styles/contact.module.scss";

function Contact() {
  const [, setLightMode] = useAtom(lightModeAtom);

  useEffect(() => {
    setLightMode(true);

    return () => setLightMode(false);
  });

  return (
    <>
      <Head>
        <title>MNDLSS Pictures - Contact</title>
      </Head>
      <div className={styles.contact}>
        <a href="mailto:contact@mndlss.tv" className={styles.email}>
          contact@mndlss.tv
        </a>
        <About />
      </div>
    </>
  );
}

export default Contact;
