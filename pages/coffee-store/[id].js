import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import cls from "classnames";
import useSWR from "swr";

import { StoreContext } from "../../store/store-context";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

import { isEmpty, fetcher } from "../../utils";

import styles from "../../styles/coffee-store.module.css";

/* Server Side */
export async function getStaticPaths() {
  console.log("getStaticPaths");

  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });

  console.log("paths:", paths);

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  console.log("getStaticProps- params:", params);

  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoresById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id.toString() === params.id
  );

  return {
    props: {
      coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    }, // will be passed to the page component as props
  };
}

/* Client Side */
const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, neighbourhood, voting, imgUrl } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighbourhood: neighbourhood.toString() || "",
          voting: voting || 0,
          imgUrl,
        }),
      });
      const dbCoffeeStore = response.json();
      console.log({ dbCoffeeStore });
    } catch (error) {
      console.log("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        // if (findCoffeeStoreFromContext) {
        setCoffeeStore(findCoffeeStoreFromContext);
        handleCreateCoffeeStore(findCoffeeStoreFromContext);
        // }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore, coffeeStores]);

  const {
    address = "",
    name = "",
    neighbourhood = "",
    imgUrl = "",
  } = coffeeStore || {};
  const [votingCount, setVotingCount] = useState(0);

  const { data } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading ...</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = response.json();

      console.log("dbCoffeeStore - favoriteCoffeeStoreById::", dbCoffeeStore);

      // if (dbCoffeeStore && dbCoffeeStore.length > 0) {
      let count = votingCount + 1;
      setVotingCount(count);
      // }
    } catch (error) {
      console.log("Err upvoting coffee store", error);
    }
  };

  if (data?.error?.error) {
    return <div>Something went wrong retrieving coffee stor page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={24}
              alt="place-icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
              alt="nearme-icon"
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
