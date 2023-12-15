import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google credentials");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId!,
      clientSecret: getGoogleCredentials().clientSecret!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      const oneDay = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

      if (!dbUser) {
        if (!user) {
          return {
            id: "",
            name: token.name,
            email: token.email,
            picture: token.picture,
            exp: oneDay,
          };
        } else {
          token.id = user!.id;
          token.name = user!.name;
          token.email = user!.email;
          token.picture = user!.image;
          token.exp = oneDay;

          return token;
        }
      }

      const dbUserParse = JSON.parse(dbUser);

      return {
        id: dbUserParse.id,
        name: dbUserParse.name,
        email: dbUserParse.email,
        picture: dbUserParse.image,
        exp: oneDay,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;

        return session;
      }

      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
