import axios from "axios";
import { serverUrl, userUrls } from "./urls";
import { Session } from "../utils/session";





export interface IUserInfoResponse {
    id: number;
    username: string;
}

type getUserInfoFunType = () => Promise<IUserInfoResponse>;
export const getUserInfoApi: getUserInfoFunType = async () => {
    const session = new Session();
    const response = await axios.get(serverUrl + userUrls.userInfo, {
        headers: { Authorization: `Bearer ${session.token}` }
    })
    return response.data as IUserInfoResponse;
}