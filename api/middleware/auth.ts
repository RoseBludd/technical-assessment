import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export const isAuthenticated = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Authentication error" });
  }
};

export const hasRole = (roles: string[]) => {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    try {
      const session = await getSession({ req });
      if (!session?.user?.role || !roles.includes(session.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: "Role verification error" });
    }
  };
};
