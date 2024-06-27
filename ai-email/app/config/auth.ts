import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          scope:
            "profile email openid https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ token, session }: any) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;

      return session;
    },

    async jwt({ token, account }: any) {
      if (account) {
        (token.accessToken = account.access_token),
          (token.refreshToken = account.refresh_token);
      }
      return token;
    },
  },
};
