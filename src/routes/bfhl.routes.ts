import { Router } from "express";
import { handleBfhlPost, handleHealthCheck } from "../controllers/bfhl.controller";

const router = Router();

// POST /bfhl - Main functional endpoint
router.post("/bfhl", handleBfhlPost);

// GET /health - Health check endpoint
router.get("/health", handleHealthCheck);

export default router;
