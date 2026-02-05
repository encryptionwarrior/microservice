import express from "express";
import cors from "cors";
import helment from "helmet";
import dotenv from "dotenv";
import { corsOptions, errorHandler, healthCheck } from "@shared/middleware";
import tagsRoutes from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors(corsOptions()));
app.use(helment());

app.use("/tags", tagsRoutes);
app.use("/health", healthCheck);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log(`Tags service is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

const garcefulShutdown = async () => {
  console.log("🚦 Shutting down Tags Service...");
  server.close(() => {
    console.log("✅ Tags Service shut down gracefully");
    process.exit(0);
  });
};

process.on("SIGINT", garcefulShutdown);
process.on("SIGTERM", garcefulShutdown);

export default app;
