import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { corsOptions, errorHandler, healthCheck } from "@shared/middleware";
import notesRoutes from "./routes"; 


dotenv.config({
    path: require('path').resolve(__dirname, "../.env"),
});

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors(corsOptions()));
app.use(helmet());

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));


app.use("/notes", notesRoutes);
app.get("/health", healthCheck);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
    console.log(`Notes service is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/health`);

})

const gracefulShutdown = async () => {
    console.log("Shutting down server...");

    try {
      console.log("Kafka producer disconnected.");
  } catch (error) {
    console.error("Error during Kafka producer disconnection:", error);
  }

  server.close(() => {
    console.log("Notes Service shut down gracefully");
    process.exit(0);
})
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);



export default app;