import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1966191",
  key: "706aa780d422cb8d9693",
  secret: "a27e4beec55735ce10ec",
  cluster: "sa1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  "706aa780d422cb8d9693",
  {
    cluster: "sa1"!,
  }
);
