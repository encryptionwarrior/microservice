import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes";
import { corsOptions, errorHandler } from "@shared/middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions()));
app.use(helmet());

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});

export default app;

