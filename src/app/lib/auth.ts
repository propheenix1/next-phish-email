//lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Secret Login',
      credentials: {
        secretId: { label: 'Secret ID', type: 'text' },
        secretPassword: { label: 'Secret Password', type: 'password' },
        secretUserName: { label: 'Secret User Name', type: 'text' },
      },
      async authorize(credentials) {
        if (
          !credentials?.secretId ||
          !credentials?.secretPassword ||
          !credentials?.secretUserName
        ) {
          return null;
        }

        try {
          // ตรวจสอบ Secret ID ผ่าน API
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/check-secret`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ secretID: credentials.secretId }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const secretCheckResult = await response.json();

          // ตรวจสอบ Password และ Username
          if (
            credentials.secretPassword === process.env.SECRET_PASSWORD &&
            credentials.secretUserName === process.env.SECRET_USER_NAME
          ) {
            return {
              id: credentials.secretPassword,
              name: credentials.secretUserName,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login-secret',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};