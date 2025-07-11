import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import type { AuthenticatedRequest } from "../src/types/user";
import { authenticateToken } from "./middleware/auth.middleware";
import { findUserById } from "./utils/db";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);

// CORS configuration for cross-origin requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

app.use("/api/auth", authRoutes);

// JWT-based protected route
app.get(
  "/api/protected-jwt",
  authenticateToken,
  (req: Request, res: Response) => {
    res.json({
      message: "Access granted",
      user: (req as AuthenticatedRequest).user,
    });
  }
);

// User profile endpoint
app.get(
  "/api/user/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await findUserById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});

export default app;
