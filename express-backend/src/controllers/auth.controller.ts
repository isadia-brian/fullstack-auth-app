import { type Request, type Response } from "express";
import { generateTokens } from "../utils/jwt";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import { users } from "../db/schema";
import { NewUserSchema, LoginUserSchema } from "../schemas/users.schema";
import { checkExistingUser } from "../utils/db";
import type { InsertUser } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const signUpUser = async (req: Request, res: Response) => {
  const result = NewUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: result.error.message,
    });
  }

  const user = result.data;

  try {
    const existingUser = await checkExistingUser(user.email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }
    const hashedPassword = await hashPassword(user.password);

    const newUser: InsertUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role || "user",
    };

    await db.insert(users).values(newUser);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const result = LoginUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error,
    });
  }

  const user = result.data;

  try {
    const { email, password } = user;

    const existingUser = await checkExistingUser(email);
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, error: "This email is not registered" });
    }

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(existingUser);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const refreshUserToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh-secret",
      async (
        err: VerifyErrors | null,
        decoded: string | JwtPayload | undefined
      ) => {
        if (err)
          return res.status(403).json({ error: "Invalid refresh token" });

        const payload = decoded as JwtPayload & { id: string };

        const user = await db.query.users.findFirst({
          where: eq(users.id, payload.id),
        });

        if (!user) return res.status(403).json({ error: "User not found" });

        const { accessToken, refreshToken: newRefreshToken } =
          generateTokens(user);

        // Update refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
};
