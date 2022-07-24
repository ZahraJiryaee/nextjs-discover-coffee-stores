/* ------------ initialize unsplash ------------*/

import { createApi } from "unsplash-js";

// on your node server
const unsplashServerApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashServerApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  console.log("photos:", photos);
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee stores", limit),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();

  const transformedData =
    data?.results?.map((venue, idx) => {
      return {
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
        imgUrl: photos[idx],
      };
    }) || [];

  console.log("transformedData", transformedData);
  return transformedData;
};
