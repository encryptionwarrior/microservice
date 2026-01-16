import { Router } from "express";

const router = Router();


router.get("/health", (req, res) => {
  res.status(200).send("Auth service is healthy");
});

export default router;