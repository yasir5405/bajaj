import { Router } from "express";
import {
  handleBfhlPost,
  handleHealthCheck,
} from "../controllers/bfhl.controller";

const router = Router();

router.post("/bfhl", handleBfhlPost);

router.get("/health", handleHealthCheck);

export default router;
