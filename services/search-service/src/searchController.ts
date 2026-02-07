import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const search = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticatred" });
      return;
    }


    const {
       q: query,
      tags,
      page = 1,
      size = 20,
      sortBy = "relevance",
      sortOrder = "desc",
      fuzzy = true,
      fuzziness = "AUTO",
      dateFrom,
      dateTo,
      createdLast,
      contentLength,
    } = req.query;

     const pageNum = Math.max(1, parseInt(page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(size as string) || 20)); // Max 100 results per page
    const from = (pageNum - 1) * pageSize;

      let tagArray: string[] = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagArray = tags as string[];
      } else if (typeof tags === "string") {
        tagArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

     const searchQuery: SearchQuery = {
      query: query as string,
      userId,
      tags: tagArray.length > 0 ? tagArray : undefined,
      from,
      size: pageSize,
      sortBy: sortBy as "relevance" | "created" | "updated",
      sortOrder: sortOrder as "asc" | "desc",
      // Advanced search parameters
      fuzzy: fuzzy === "true" || fuzzy === true,
      fuzziness:
        fuzziness === "AUTO" ? "AUTO" : parseInt(fuzziness as string) || "AUTO",
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      createdLast: createdLast as string,
      contentLength: contentLength as "short" | "medium" | "long",
    };

  } catch (error) {}
};
