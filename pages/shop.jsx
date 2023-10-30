import Head from "next/head";
import { useAtom } from "jotai";
import { PRODUCTS } from "@/data/shop";
import { CDN_URL } from "@/lib/constants";
import { productPreviewAtom } from "@/lib/state";
import FreeSample from "@/components/free-sample";
import ProductCard from "@/components/product-card";
import styles from "@/styles/shop.module.scss";

function Shop() {
  const [, setProductPreview] = useAtom(productPreviewAtom);

  const onClickProduct = (product) => {
    setProductPreview(product);
  };

  return (
    <>
      <Head>
        <title>MNDLSS Pictures - Shop</title>
      </Head>
      <div className={styles.shop}>
        <FreeSample />
        <div className={styles["shop-note"]}>
          All packs will be updated with new assets for holders, free of charge
        </div>
        <div className={styles.products}>
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.title}
              title={product.title}
              image={product.images[0]}
              price={product.price}
              onClick={() => onClickProduct(product)}
            />
          ))}
        </div>
      </div>
      <img
        className={styles.mob}
        src={`${CDN_URL}/images/misc/mob-comp.png`}
        alt=""
      />
    </>
  );
}

export default Shop;
