import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user", // Basicamente isso diz que só preciso de informações básicas
      //! Porém é possivel conseguir muito mais informações com outros scopes
    }),
  ],
});
