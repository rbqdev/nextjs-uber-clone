export const getPrice = ({
  distance,
  minimumPrice,
  pricePerMeters,
}: {
  distance: number;
  minimumPrice: number;
  pricePerMeters: number;
}) => {
  const oneKM = 1000;
  let price = 0;

  if (distance < oneKM) {
    price = minimumPrice / 100;
  } else {
    price = (minimumPrice + (pricePerMeters * distance - oneKM)) / 100;
  }

  console.log({ price });

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
