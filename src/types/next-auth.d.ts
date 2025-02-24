import "next-auth";
import { developer_role } from "@prisma/client";

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
