import Head from "next/head";
import Image from "next/image";

import Banner from "../components/banner";
import Card from "../components/card";

import styles from "../styles/Home.module.css";

export default function Home() {
  const handleOnBannerButtonClick = () => {
    console.log("banner click");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerButtonClick}
        />
        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} width={700} height={400} />
        </div>
        <Card
          name="DarkHorse Coffee"
          imgUrl="/static/hero-image.png"
          href="/coffee-store/darkhorse-coffee"
        />
      </main>
    </div>
  );
}
