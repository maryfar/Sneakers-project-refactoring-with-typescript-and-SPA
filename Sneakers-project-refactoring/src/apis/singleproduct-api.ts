
import { Session } from "../utils/session";
import axios from "axios";
import { serverUrl, sneakerUrls } from "./urls";



type getSingleProductApiFuncType = (_:number) => Promise<string[]>;
export const getSingleProductApi: getSingleProductApiFuncType = async (id:number) => {
  const session = new Session();
  const response = await axios.get(serverUrl + sneakerUrls.item+`/${id}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  return response.data as string[];
};
