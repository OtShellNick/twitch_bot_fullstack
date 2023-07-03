import Server from "@helpers/server";

export const login = code => Server.post("auth/login", { code });

export const logout = () => Server.logout();

export const getSelf = () => Server.get("user");

export const checkAccess = () => !!localStorage.getItem("authorization");
