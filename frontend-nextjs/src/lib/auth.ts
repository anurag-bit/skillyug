import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      email: string
      name?: string | null
      role?: string
      accessToken?: string
    }
  }

  interface User {
    role?: string
    token?: string
  }
}

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Make API call to your backend for authentication
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()
          
          if (user && user.token) {
            return {
              id: user.user.id,
              email: user.user.email,
              name: user.user.full_name || user.user.email,
              role: user.user.role,
              token: user.token,
            }
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || ""
        session.user.role = token.role as string
        session.user.accessToken = token.accessToken as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
}

// Add missing auth functions that other components are trying to import
export async function registerUser(userData: {
  name?: string;
  email: string;
  password: string;
  full_name?: string;
  user_type?: string;
  userType?: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
      throw new Error('OTP verification failed')
    }

    return await response.json()
  } catch (error) {
    console.error('OTP verification error:', error)
    throw error
  }
}

// Add signup schema using Zod
export const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation must be at least 6 characters"),
  userType: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Add UserType enum
export enum UserType {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  MENTOR = 'mentor'
}

// Re-export auth for server-side usage
export { auth as getServerSession }

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// Add the missing resendOtp function that verify-email page is trying to import
export async function resendOtp(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error('Failed to resend OTP')
    }

    return await response.json()
  } catch (error) {
    console.error('Resend OTP error:', error)
    throw error
  }
}
