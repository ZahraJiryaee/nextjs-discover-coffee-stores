import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import coffeeStoresData from "../../data/coffee-stores.json";

/* Server Side */
export function getStaticPaths() {
  console.log("getStaticPaths");

  const paths = coffeeStoresData.map((coffeeStore) => {
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

  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (coffeeStore) => coffeeStore.id.toString() === params.id
      ),
    }, // will be passed to the page component as props
  };
}

/* Client Side */
const CoffeeStore = (props) => {
  const router = useRouter();
  console.log("router:", router);
  console.log("props - id:", props);

  if (router.isFallback) {
    return <div>Loading ...</div>;
  }

  const { address, name, neighbourhood } = props.coffeeStore;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href="/">
        <a>back to home</a>
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
