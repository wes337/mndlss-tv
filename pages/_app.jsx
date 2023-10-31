import { useEffect } from "react";
import { useAtom } from "jotai";
import { lightModeAtom, altModeAtom } from "@/lib/state";
import Cursor from "@/components/cursor";
import Backdrop from "@/components/backdrop";
import TopBar from "@/components/top-bar";
import ProductPreview from "@/components/product-preview";
import Transition from "@/components/transition";
import TransitionSwipe from "@/components/transition-swipe";
import Footer from "@/components/footer";
import "@/styles/app.scss";

export default function App({ Component, pageProps }) {
  const [lightMode] = useAtom(lightModeAtom);
  const [altMode] = useAtom(altModeAtom);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }

    return () => document.body.classList.remove("light");
  }, [lightMode]);

  useEffect(() => {
    if (altMode) {
      document.body.classList.add("alt");
    } else {
      document.body.classList.remove("alt");
    }

    return () => document.body.classList.remove("alt");
  }, [altMode]);

  return (
    <>
      <Cursor />
      <Backdrop />
      <TopBar />
      <Component {...pageProps} />
      <ProductPreview />
      <Transition />
      <TransitionSwipe />
      <Footer />
    </>
  );
}
