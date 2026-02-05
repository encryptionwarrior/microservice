import { CreateTagRequest, Tag } from "@shared/types";
import { createServiceError, sanitizeInput } from "@shared/utils";
import prisma from "./database";

export class TagsService {
  async createTag(userId: string, tagData: CreateTagRequest): Promise<Tag> {
    const sanitizedName = sanitizeInput(tagData.name);
    const sanitizeColor = tagData.color
      ? sanitizeInput(tagData.color)
      : undefined;

    if (sanitizeColor && !this.isValidHexColor(sanitizeColor)) {
      throw createServiceError(
        "Invalid color format, Use hex color format (eg: #FF5733 or #F73)",
        400,
      );
    }

    try {
      const tag = await prisma.tag.create({
        data: {
          userId,
          name: sanitizedName,
          color: sanitizeColor,
        },
      });

      return tag as Tag;
    } catch (error) {
      if (error.code === "P2002") {
        throw createServiceError("tag name already exists", 409);
      }

      throw createServiceError("Failed to create tag", 500);
    }
  }


  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return hexColorRegex.test(color);
  }
}
