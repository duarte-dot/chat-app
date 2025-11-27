import PusherServer from "pusher";
import PusherClient from "pusher-js";

const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const secret = process.env.PUSHER_APP_SECRET;
const cluster = process.env.PUSHER_APP_CLUSTER;

export const pusherServer = new PusherServer({
  appId: pusherAppId!,
  key: pusherKey!,
  secret: secret!,
  cluster: cluster!,
  useTLS: true,
});

export const pusherClient = new PusherClient(pusherKey!, {
  cluster: cluster!,
});
