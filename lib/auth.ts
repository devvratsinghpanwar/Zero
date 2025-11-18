import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { kv } from "@/lib/kv-config"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { getServerSession } from "next-auth/next"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email)

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password as string)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          let existingUser = await getUserByEmail(user.email!)
          
          if (!existingUser) {
            const randomString = crypto.randomBytes(6).toString("base64url")
            const userId = `user_${Date.now()}_${randomString}`
            
            await kv.hset(`user:${userId}`, {
              name: user.name || "",
              email: user.email!,
              provider: "google",
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
              createdAt: new Date().toISOString(),
            })
            
            await kv.set(`email:${user.email!}`, userId)
            user.id = userId
          } else {
            await kv.hset(`user:${existingUser.id}`, {
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
              lastLogin: new Date().toISOString(),
            })
            
            user.id = existingUser.id
          }
          
          return true
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.provider = account.provider
      }

      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.accessToken = token.accessToken as string
      session.user.refreshToken = token.refreshToken as string
      session.user.expiresAt = token.expiresAt as number
      session.user.provider = token.provider as string
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        maxAge: 7 * 24 * 60 * 60
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getUserByEmail(email: string): Promise<any> {
  const userId = await kv.get(`email:${email}`)
  if (!userId) return null

  const user = await kv.hgetall(`user:${userId}`)
  return user ? { ...user, id: userId as string } : null
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const randomString = crypto.randomBytes(6).toString("base64url")
  const userId = `user_${Date.now()}_${randomString}`

  await kv.hset(`user:${userId}`, {
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
    createdAt: new Date().toISOString(),
  })

  await kv.set(`email:${email}`, userId)

  return {
    id: userId,
    name,
    email,
  }
}

export async function getUserTimezone(userId: string): Promise<string> {
  const userData = await kv.hgetall(`user:${userId}`)
  return (userData?.timezone as string) || "America/New_York"
}

export async function setUserTimezone(userId: string, timezone: string): Promise<void> {
  await kv.hset(`user:${userId}`, { timezone })
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function saveUserPreferences(userId: string, preferences: any): Promise<void> {
  try {
    // Save user preferences to Redis
    await kv.hset(`user:${userId}`, {
      preferences: JSON.stringify(preferences),
      updatedAt: new Date().toISOString(),
    })

    // Also save individual preference fields for easier access
    if (preferences.name) {
      await kv.hset(`user:${userId}`, { name: preferences.name })
    }
    
    if (preferences.timezone) {
      await kv.hset(`user:${userId}`, { timezone: preferences.timezone })
    }

    if (preferences.theme) {
      await kv.hset(`user:${userId}`, { theme: preferences.theme })
    }

    if (preferences.defaultView) {
      await kv.hset(`user:${userId}`, { defaultView: preferences.defaultView })
    }

    if (preferences.workingHours) {
      await kv.hset(`user:${userId}`, { workingHours: JSON.stringify(preferences.workingHours) })
    }

    if (preferences.workDays) {
      await kv.hset(`user:${userId}`, { workDays: JSON.stringify(preferences.workDays) })
    }

    if (typeof preferences.showWeekends !== 'undefined') {
      await kv.hset(`user:${userId}`, { showWeekends: preferences.showWeekends.toString() })
    }

    if (typeof preferences.enableNotifications !== 'undefined') {
      await kv.hset(`user:${userId}`, { enableNotifications: preferences.enableNotifications.toString() })
    }

    if (typeof preferences.showWeekNumbers !== 'undefined') {
      await kv.hset(`user:${userId}`, { showWeekNumbers: preferences.showWeekNumbers.toString() })
    }

    if (preferences.defaultDuration) {
      await kv.hset(`user:${userId}`, { defaultDuration: preferences.defaultDuration })
    }
  } catch (error) {
    console.error('Error saving user preferences:', error)
    throw new Error('Failed to save user preferences')
  }
}

export async function getUserPreferences(userId: string): Promise<any> {
  try {
    const userData = await kv.hgetall(`user:${userId}`)
    
    if (!userData) {
      return {}
    }

    // Parse stored preferences
    const preferences: any = {}
    
    if (userData.preferences) {
      try {
        const parsedPreferences = JSON.parse(userData.preferences as string)
        Object.assign(preferences, parsedPreferences)
      } catch (e) {
        // Fallback to individual fields if JSON parsing fails
      }
    }

    // Override with individual fields (these take precedence)
    if (userData.name) preferences.name = userData.name
    if (userData.timezone) preferences.timezone = userData.timezone
    if (userData.theme) preferences.theme = userData.theme
    if (userData.defaultView) preferences.defaultView = userData.defaultView
    if (userData.workingHours) {
      try {
        preferences.workingHours = JSON.parse(userData.workingHours as string)
      } catch (e) {
        preferences.workingHours = { start: "09:00", end: "17:00" }
      }
    }
    if (userData.workDays) {
      try {
        preferences.workDays = JSON.parse(userData.workDays as string)
      } catch (e) {
        preferences.workDays = [1, 2, 3, 4, 5]
      }
    }
    if (userData.showWeekends) preferences.showWeekends = userData.showWeekends === 'true'
    if (userData.enableNotifications) preferences.enableNotifications = userData.enableNotifications === 'true'
    if (userData.showWeekNumbers) preferences.showWeekNumbers = userData.showWeekNumbers === 'true'
    if (userData.defaultDuration) preferences.defaultDuration = userData.defaultDuration

    return preferences
  } catch (error) {
    console.error('Error getting user preferences:', error)
    return {}
  }
}