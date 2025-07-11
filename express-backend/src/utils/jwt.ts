import jwt from "jsonwebtoken";
import type { User } from "../db/schema";

type generatedUser = Pick<User, "id" | "email" | "role" | "name">;

export const generateTokens = (user: generatedUser) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_ACCESS_SECRET || "access-secret",
    { expiresIn: "15m" }
  );

  const accessToken = `Bearer ${token}`;

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || "refresh-secret",
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
