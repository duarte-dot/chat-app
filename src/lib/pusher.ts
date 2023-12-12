import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1723848",
  key: "0e5e5eeb013deb233fba",
  secret: "5e5479a40eb86ccbcd02",
  cluster: "sa1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient("0e5e5eeb013deb233fba", {
  cluster: "sa1"!,
});
