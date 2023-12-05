import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: '1718684',
  key: '7e4d8b27417cda395ba5',
  secret: 'c141b2f73e00d710e406',
  cluster: "sa1"!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: "sa1"!,
  }
);