import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import { ACTION_TYPE, StoreContext } from "./_app";

import Banner from "../components/banner";
import Card from "../components/card";

import { fetchCoffeeStores } from "../lib/coffee-stores";

import useTrackLocation from "../hooks/use-track-location";

import styles from "../styles/Home.module.css";

/* Server Side */
export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

/* Client Side */
export default function Home(props) {
  console.log("props", props);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  console.log({ latLong, locationErrorMsg });

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          console.log({ fetchedCoffeeStores });
          dispatch({
            type: ACTION_TYPE.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores },
          });
        } catch (error) {
          console.log({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    fetchData();
  }, [latLong]);

  const handleOnBannerButtonClick = () => {
    console.log("banner click");
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} width={700} height={400} />
        </div>
        {/* STORS NEAR ME */}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near ne</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
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
          </div>
        )}
        {/* TORONTO STORS */}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
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
          </div>
        )}
      </main>
    </div>
  );
}
