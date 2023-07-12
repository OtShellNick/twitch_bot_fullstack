import Server from "@helpers/server";
import { Account } from "next-auth";

interface TLoginData extends Account { }

export const login = async (data: TLoginData) => await Server({ url: "auth/login", method: 'POST', data });