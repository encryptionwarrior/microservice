import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { corsOptions, healthCheck } from "@shared/middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors(corsOptions()));
app.use(helmet());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthCheck);

const server = app.listen(PORT, async () => {
  console.log(`🔍 Search service is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Search API: http://localhost:${PORT}/search`);
  console.log("");
});

const grafcefulShutdown = async () => {
  console.log("🚦 Shutting down Search Service...");
  server.close(() => {
    console.log("✅ Search Service shut down gracefully");
    process.exit(0);
  });
};

process.on("SIGINT", grafcefulShutdown);
process.on("SIGTERM", grafcefulShutdown);

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  grafcefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  grafcefulShutdown();
});
