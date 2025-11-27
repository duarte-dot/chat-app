import PusherServer from "pusher";
import PusherClient from "pusher-js";

const { PUSHER_APP_ID: appId, PUSHER_APP_SECRET: secret, PUSHER_APP_CLUSTER: cluster } = process.env;

export const pusherServer = new PusherServer({
  appId: appId!,
  key: "56236ec0fa30b0d11a08",
  secret: secret!,
  cluster: "sa1",
  useTLS: true,
});

export const pusherClient = new PusherClient("56236ec0fa30b0d11a08", {
  cluster: "sa1",
});
