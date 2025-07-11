import { type Request } from "express";

export interface User {
  id: string;
  email: string;
  role: "user" | "moderator" | "supervisor";
  password: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: "user" | "moderator" | "supervisor";
    name: string;
  };
}
