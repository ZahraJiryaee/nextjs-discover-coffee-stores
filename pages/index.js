import Head from "next/head";
import Image from "next/image";

import Banner from "../components/banner";
import Card from "../components/card";

import styles from "../styles/Home.module.css";

/* Server Side */
export async function getStaticProps(context) {
  const response = await fetch(
    "https://api.foursquare.com/v3/places/nearby?ll=43.65267326999575,-79.39545615725015&query=coffee stores&v=20220105&limit=7",
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();

  const transformedData =
    data?.results?.map((venue) => {
      return {
        id: venue.fsq_id,
        ...venue,
      };
    }) || [];

  console.log("transformedData", transformedData);

  return {
    props: { coffeeStores: transformedData }, // will be passed to the page component as props
  };
}

/* Client Side */
export default function Home(props) {
  console.log("props", props);

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
        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
