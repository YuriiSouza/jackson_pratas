import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

const adminEmails = ['yuripeixoto1112@gmail.com']

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  callbacks: {
    session: ({ session, token, user}) => {
      
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }

      return session;
    },
  }
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req,res,authOptions);

  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not admin';
  }
}