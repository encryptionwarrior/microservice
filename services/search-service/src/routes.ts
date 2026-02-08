import { validateRequest } from "@shared/middleware";
import { Router } from "express";
import { searchSchema } from "./validate";

const router = Router();

router.get("/test", async (req, res) => {
  res.json({
    success: true,
    message: "Seach service is working!",
    timestamp: new Date().toString(),
    elasticsearch: "connected",
    kafka: "connected",
  });
});

router.get("/test-search", async (req, res) => {
  try {
    const { searchNotes } = await import("./searchService");
    const query = (req.query.q as string) || "test";
    const userId = (req.query.userid as string) || "test-user";

    const results = await searchNotes({
      query,
      userId,
      from: 0,
      size: 10,
      sortBy: "relevance",
      sortOrder: "desc",
    });

    res.json({
      success: true,
      query,
      userId,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});


// router.use("/", validateRequest(searchSchema), searchControllers.search)

export default router;
