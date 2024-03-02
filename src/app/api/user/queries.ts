import { UserResponse } from "./sharedTypes";

export const getUser = async (url: string) => {
  try {
    const response = await fetch(url);
    const { data: user } = await response.json();
    return user as UserResponse;
  } catch (error) {
    console.error("Something went wrong with get user!");
  }
};
