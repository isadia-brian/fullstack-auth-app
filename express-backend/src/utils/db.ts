import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type User } from "../db/schema";

type RedactedUser = Pick<User, "email" | "password" | "role" | "name" | "id">;

export const checkExistingUser = async (
  email: User["email"]
): Promise<RedactedUser | null> => {
  if (!email) {
    return null;
  }
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) return null;
    return existingUser as RedactedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type UserById = Pick<User, "id" | "email" | "role" | "name">;

export const findUserById = async (
  id: User["id"]
): Promise<UserById | null> => {
  if (!id) {
    return null;
  }
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
