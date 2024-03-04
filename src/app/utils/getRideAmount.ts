export const getRideAmount = ({
  distance,
  minimumAmount,
  percentagePerMeters,
}: {
  distance: number;
  minimumAmount: number;
  percentagePerMeters: number;
}) => {
  const oneKM = 1000;
  let price = 0;

  if (distance < oneKM) {
    price = minimumAmount / 100;
  } else {
    price = (minimumAmount + (percentagePerMeters * distance - oneKM)) / 100;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
