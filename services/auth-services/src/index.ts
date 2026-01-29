import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes";
import { corsOptions, errorHandler, healthCheck } from "@shared/middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions()));
app.use(helmet());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/health", healthCheck);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});

const gracefulShutdown = async () => {
  console.log("Shutting down server...");
  try {
    const producer = getKafkaProducer("auth-service");
    await producer?.disconnect();
    console.log("Kafka producer disconnected.");
  } catch (error) {
    console.error("Error during Kafka producer disconnection:", error);
  }

  server.close(() => {
    console.log("Auth service has been shut down.");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default app;
