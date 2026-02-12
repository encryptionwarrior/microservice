import { TagsServiceClient } from "./tagsServiceClient";
import { createServiceError, sanitizeInput,  CreateNoteRequest, Note } from "@microservices-practice/shared";
import prisma from "./database";

export class NotesService {
  private tagServiceClient: TagsServiceClient;
  constructor() {
    this.tagServiceClient = new TagsServiceClient();
  }

  async createNote(
    userId: string,
    noteData: CreateNoteRequest,
    authToken?: string,
  ): Promise<Note> {
    const sanitizedTitl = sanitizeInput(noteData.title);
    const sanitizedContent = sanitizeInput(noteData.content);

    const note = await prisma.note.create({
      data: {
        userId,
        title: sanitizedTitl,
        content: sanitizedContent,
      },
      include: {
        noteTags: true,
      },
    });

    if (noteData.tagIds && note.noteTags.length == 0) {
      if (authToken) {
        await this.tagServiceClient.validateTags(noteData.tagIds, authToken);
      }

      await this.addTagsToNote(note.id, noteData.tagIds);

      const noteWithTags = await this.getNoteById(note.id, userId);

      return noteWithTags;
    }

    return note as Note;
  }

  async getNoteById(noteId: string, userId: string): Promise<Note> {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        isDeleted: false,
      },
      include: {
        noteTags: true,
      },
    });

    if (!note) {
      throw createServiceError("Note not found", 404);
    }

    return note as Note;
  }

  async getNotesByUser(
    userId: string,
    page: number = 1,
    limit: number = 50,
    search?: string,
  ): Promise<{
    notes: Note[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId,
      isDeleted: false,
    };

    if (search) {
      const sanitizeSearch = sanitizeInput(search);
      whereClause.OR = [
        {
          title: {
            contains: sanitizeSearch,
            mode: "insentive",
          },
        },
        {
          content: {
            contains: sanitizeSearch,
            mode: "insentive",
          },
        },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: whereClause,
        include: {
          noteTags: true,
        },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.note.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notes,
      total,
      page,
      totalPages,
    };
  }

  private async addTagsToNote(noteId: string, tagIds: string[]): Promise<void> {
    const noteTagData = tagIds.map((tagId) => ({
      noteId,
      tagId,
    }));

    await prisma.noteTag.createMany({
      data: noteTagData,
      skipDuplicates: true,
    });
  }
}
