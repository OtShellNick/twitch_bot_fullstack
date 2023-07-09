import Server from "@helpers/server";
import { Account } from "next-auth";

export const login = async (data: TLoginData) => await Server({ url: "auth/login", method: 'POST', data });

// export const logout = () => Server.logout();

// export const getSelf = async () => await Server({ url: 'user/self' });

// export const checkAccess = () => !!localStorage.getItem("authorization");

interface TLoginData extends Account { }