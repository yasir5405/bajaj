import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bfhlRoutes from "./routes/bfhl.routes";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    is_success: false,
    official_email:
      process.env.OFFICIAL_EMAIL || "yasir0393.be23@chitkara.edu.in",
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(limiter);

app.use("/", bfhlRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    endpoints: {
      health: "GET /health",
      bfhl: "POST /bfhl",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    official_email:
      process.env.OFFICIAL_EMAIL || "yasir0393.be23@chitkara.edu.in",
    message: "Endpoint not found",
  });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      is_success: false,
      official_email:
        process.env.OFFICIAL_EMAIL || "yasir0393.be23@chitkara.edu.in",
      message: "Internal server error",
    });
  },
);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`The server is running at: http://localhost:${PORT}`);
  });
}

export default app;
