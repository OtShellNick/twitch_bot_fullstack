import Server from "@helpers/server";

export const switchBot = (status: boolean) => Server({ url: 'bot/switch', method: "POST", data: { status } });