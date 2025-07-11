import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import type { AuthenticatedRequest, User } from "../types/user";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET || "access-secret",
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      const payload = decoded as JwtPayload & User;
      (req as AuthenticatedRequest).user = payload;
      next();
    }
  );
};
