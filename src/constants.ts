import { getBaseUrl } from "./utils/getBaseUrls";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL! || getBaseUrl();
export const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
