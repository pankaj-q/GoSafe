import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
      : CredentialsProvider({
          name: 'Phone',
          credentials: {
            phone: { label: 'Phone', type: 'tel' },
            otp: { label: 'OTP', type: 'text' },
          },
          async authorize() {
            return { id: 'guest', name: 'Guest User', phone: '0000000000' }
          },
        }),
  ].filter(Boolean),
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
