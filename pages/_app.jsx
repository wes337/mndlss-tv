import { useEffect } from "react";
import { useAtom } from "jotai";
import { lightModeAtom } from "@/lib/state";
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

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }

    return () => document.body.classList.remove("light");
  }, [lightMode]);

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
