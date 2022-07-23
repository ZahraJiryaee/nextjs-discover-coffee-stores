import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();

  return (
    <div>
      <h1>ji {router.query.id}</h1>
      <Link href="/">
        <a>back to home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
