import { CreateTagRequest, Tag } from "@shared/types";
import { createServiceError, isValidUUID, sanitizeInput } from "@shared/utils";
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

  async getTagsByUser(
    page: number = 1,
    limit: number = 50,
    search?: string,
    userId?: string,
  ): Promise<{
    tags: Tag[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId,
    };

    if (search) {
      const sanitizedSearch = sanitizeInput(search);
      whereClause.name = {
        contains: sanitizedSearch,
        mode: "insensitive",
      };
    }

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.tag.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tags: tags as Tag[],
      total,
      page,
      totalPages,
    };
  }

  async getTagById(tagId: string, userId: string): Promise<Tag> {
    if (!isValidUUID(tagId)) {
      throw createServiceError("invalid tag id", 400);
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

    if (!tag) {
      throw createServiceError("tag not found", 404);
    }

    return tag as Tag;
  }

  async validateTags(
    tagIds: string[],
    userId: string,
  ): Promise<{
    validateTags: Tag[];
    invalidTagIds: string[];
  }> {
    const validateTags: Tag[] = [];
    const invalidTagIds: string[] = [];

    for (const tagId of tagIds) {
      if (!isValidUUID(tagId)) {
        invalidTagIds.push(tagId);
        continue;
      }

      try {
        const tag = await this.getTagById(tagId, userId);
        validateTags.push(tag);
      } catch (error) {
        invalidTagIds.push(tagId);
      }
    }

    return { validateTags, invalidTagIds };
  }

  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return hexColorRegex.test(color);
  }
}
