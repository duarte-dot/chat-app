import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1723535",
  key: "56236ec0fa30b0d11a08",
  secret: "83a5edf50b88fe9c9772",
  cluster: "sa1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  "56236ec0fa30b0d11a08",
  {
    cluster: "sa1"!,
  }
);
