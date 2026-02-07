import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { corsOptions, errorHandler, healthCheck } from "@shared/middleware";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors(corsOptions()));
app.use(helmet());

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

app.use("/health", healthCheck);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
      console.log(`User service is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});


const grafcefulShutdown = async () => {

      console.log("🚦 Shutting down User Service...");
    server.close(() => {
    console.log("✅ User Service shut down gracefully");
    process.exit(0);
  });
}

process.on("SIGINT", grafcefulShutdown);
process.on("SIGTERM", grafcefulShutdown);

export default app;
