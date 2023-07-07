import Server from "@helpers/server";

export const login = async (code: string) => await Server({ url: "auth/login", method: 'POST', data: { code } });

// export const logout = () => Server.logout();

// export const getSelf = () => Server.get("user");

// export const checkAccess = () => !!localStorage.getItem("authorization");
