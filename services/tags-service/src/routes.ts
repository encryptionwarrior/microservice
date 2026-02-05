import { authenticateToken, validateRequest } from "@shared/middleware";
import { Router } from "express";
import { createTagSchema, validateTagsSchema } from "./validation";
import * as tagController from "./tagsController";

const router = Router();

router.use(authenticateToken);

router.post("/", validateRequest(createTagSchema), tagController.createTag);

router.get("/", tagController.getTags)
router.post("/:tagId", validateRequest(validateTagsSchema), tagController.validateTags)

export default router;
