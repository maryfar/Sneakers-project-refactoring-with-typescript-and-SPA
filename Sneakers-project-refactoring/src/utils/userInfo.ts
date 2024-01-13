import { AxiosError } from "axios";
import { errorHandler } from "./errorHandler";
import { IUserInfoResponse, getUserInfoApi } from "../apis/user-api";

export const UserInfo = async (): Promise<IUserInfoResponse | undefined> => {
  try {
    return await getUserInfoApi();
  } catch (error) {
    errorHandler(<AxiosError>error);
  }
};
