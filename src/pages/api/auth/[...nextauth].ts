import { getBaseUrl } from '@/helpers/fetch';
import jwtDecode from 'jwt-decode';
import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

interface User {
  sub: string;
  email: string;
  accessToken: string;
  exp: number;
}

export interface Session {
  user: User;
}

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email', placeholder: 'email' },
        password: { label: 'password', type: 'password' },
      },
      // @ts-ignore - les types de nextauth sont fucked up
      async authorize(credentials, req) {
        const res = await fetch(`${getBaseUrl()}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const jsonPayload: { access_token: string } = await res.json();

        const decodedUser: Omit<User, 'accessToken'> = jwtDecode(
          jsonPayload.access_token
        );

        if (!decodedUser || !res.ok) {
          return null;
        }

        const user = {
          accessToken: jsonPayload.access_token,
          ...decodedUser,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }

      return session;
    },
  },
} satisfies AuthOptions;

export default NextAuth(authOptions);
