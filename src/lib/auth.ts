import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession } from "next-auth";
import { prisma } from "./prisma";
import { developer_role, developer_status } from "@prisma/client";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: developer_role;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: developer_role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: developer_role;
  }
}

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  console.warn("Missing GitHub OAuth credentials");
}

export const authConfig: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Developer Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.group("Authorization Process");
        console.log("Starting authorization for email:", credentials?.email);

        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials");
            throw new Error("Email and password are required");
          }

          // For testing, allow login with default password
          if (credentials.password === process.env.DEFAULT_DEV_PASSWORD) {
            console.log("Attempting to find developer in database");

            const developer = await prisma.developers.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
              },
            });

            console.log("Database lookup result:", {
              found: !!developer,
              status: developer?.status,
              role: developer?.role,
            });

            if (!developer) {
              console.error("Developer not found in database");
              throw new Error("Developer not found");
            }

            if (developer.status === developer_status.inactive) {
              console.error("Developer account is inactive");
              throw new Error("Account is inactive");
            }

            const user = {
              id: developer.id,
              email: developer.email,
              name: developer.name || null,
              role: developer.role,
            };

            console.log("Authorization successful:", {
              id: user.id,
              role: user.role,
            });
            console.groupEnd();
            return user;
          }

          console.error("Invalid password provided");
          throw new Error("Invalid credentials");
        } catch (error) {
          console.error("Authorization error:", error);
          console.groupEnd();
          throw error;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id && user?.role) {
        console.log("Creating JWT token for user:", {
          id: user.id,
          role: user.role,
        });
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        console.log("Creating session for user:", {
          id: token.id,
          role: token.role,
        });
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
