
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
//https://console.developers.google.com/apis/credentials ->OAuth client ID -> Web application -> name of application -> http://localhost:3000 -> http://localhost:3000/api/auth/callback/google -> create

const handler = NextAuth(authOptions)

export {handler as GET,  handler as POST}