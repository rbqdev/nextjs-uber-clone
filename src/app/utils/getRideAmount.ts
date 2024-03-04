export const getRideAmount = ({
  distance,
  minimumAmount,
  percentagePerMeters,
  locale = "en-US",
  currency = "USD",
}: {
  distance: number;
  minimumAmount: number;
  percentagePerMeters: number;
  locale: string;
  currency: string;
}) => {
  const oneKM = 1000;
  let amount = 0;

  if (distance < oneKM) {
    amount = minimumAmount / 100;
  } else {
    amount = (minimumAmount + (percentagePerMeters * distance - oneKM)) / 100;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
