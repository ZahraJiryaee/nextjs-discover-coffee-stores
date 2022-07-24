import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import coffeeStoresData from "../../data/coffee-stores.json";

/* Server Side */
export function getStaticPaths() {
  console.log("getStaticPaths");
  return {
    paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
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

  return (
    <div>
      <h1>Coffee Store Page {router.query.id}</h1>
      <Link href="/">
        <a>back to home</a>
      </Link>
      <p>{props.coffeeStore.address}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;
