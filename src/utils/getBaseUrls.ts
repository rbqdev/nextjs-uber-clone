export const getBaseUrl = () => {
  return typeof window !== "undefined" ? window.location.origin : "";
};
