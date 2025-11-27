import PusherServer from "pusher";
import PusherClient from "pusher-js";

const { PUSHER_APP_ID: appId, PUSHER_APP_SECRET: key, PUSHER_APP_KEY: secret, PUSHER_APP_CLUSTER: cluster } = process.env;

export const pusherServer = new PusherServer({
  appId: appId!,
  key: key!,
  secret: secret!,
  cluster: cluster!,
  useTLS: true,
});

export const pusherClient = new PusherClient(key!, {
  cluster: cluster!,
});
