import Server from "@helpers/server";
import { Account } from "next-auth";

interface TLoginData extends Account { }

export const login = async (data: TLoginData) => await Server({ url: "auth/login", method: 'POST', data });

export const getSelf = async () => await Server({ url: "user/self", method: 'GET' });

export const getTimers = async () => await Server({ url: "timers/list", method: 'GET' });