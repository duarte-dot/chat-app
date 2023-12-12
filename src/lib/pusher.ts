import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: '1723535',
  key: '97b95e67f3886a18c6a4',
  secret: 'bc98d45efe3c115ec604',
  cluster: "sa1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  97b95e67f3886a18c6a4,
  {
    cluster: "sa1"!,
  }
);
