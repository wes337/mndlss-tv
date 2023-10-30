import { useEffect } from "react";
import { useAtom } from "jotai";
import { CDN_URL } from "@/lib/constants";
import { getPriceInUSD } from "@/lib/utils";
import { productPreviewAtom } from "@/lib/state";
import useSpray from "@/hooks/spray";
import styles from "@/styles/product-preview.module.scss";

function ProductPreview() {
  const [productPreview, setProductPreview] = useAtom(productPreviewAtom);
  const { spray, startSprayInterval, stopSprayInterval } = useSpray();

  useEffect(() => {
    if (productPreview) {
      startSprayInterval();
    } else {
      stopSprayInterval();
    }

    return () => {
      stopSprayInterval();
    };
  }, [productPreview, startSprayInterval, stopSprayInterval]);

  if (!productPreview) {
    return null;
  }

  return (
    <>
      <div className={styles["product-preview"]}>
        <div className={styles["product-preview-inner"]}>
          <button
            className={styles["product-preview-close"]}
            onClick={() => setProductPreview(null)}
          >
            <img src={`${CDN_URL}/images/misc/close.png`} alt="Close" />
          </button>
          <div className={styles["product-preview-images"]}>
            <button className={styles.previous} onClick={() => {}}>
              <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Prev" />
            </button>
            <div className={styles["product-preview-image"]}>
              {productPreview.images.map((image) => {
                return (
                  <img
                    key={image}
                    src={`${CDN_URL}/images/shop/${image}`}
                    alt=""
                  />
                );
              })}
            </div>
            <button className={styles.next} onClick={() => {}}>
              <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Next" />
            </button>
          </div>
          <div className={styles["product-preview-info"]}>
            <div className={styles["product-preview-title"]}>
              {productPreview.title}
              <img
                className={styles.spray}
                key={spray}
                src={`${CDN_URL}/images/misc/spray-${spray}.png`}
                alt=""
              />
            </div>
            <div className={styles["product-preview-price"]}>
              {getPriceInUSD(productPreview.price)}
            </div>
            <a
              className={styles["product-preview-buy"]}
              href={productPreview.link}
            >
              Buy It Now
            </a>
            <div className={styles["product-preview-description"]}>
              {productPreview.description}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles["product-preview-backdrop"]}
        onClick={() => setProductPreview(null)}
      />
    </>
  );
}

export default ProductPreview;
