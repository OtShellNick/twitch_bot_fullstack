import Server from "@helpers/server";
import { Account } from "next-auth";

export const login = async (data: TLoginData) => await Server({ url: "auth/login", method: 'POST', data });

// export const logout = () => Server.logout();

// export const getSelf = () => Server.get("user");

// export const checkAccess = () => !!localStorage.getItem("authorization");

interface TLoginData extends Account { }