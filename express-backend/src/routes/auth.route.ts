import express from "express";

import {
  loginUser,
  logoutUser,
  refreshUserToken,
  signUpUser,
} from "../controllers/auth.controller";

const router = express.Router();

// Sign Up endpoint

router.post("/signup", signUpUser);

// Login endpoint
router.post("/login", loginUser);

// Refresh token endpoint
router.post("/refresh", refreshUserToken);

// Logout endpoint
router.post("/logout", logoutUser);

export default router;
