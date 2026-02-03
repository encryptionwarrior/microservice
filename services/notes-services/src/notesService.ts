import { CreateNoteRequest, Note } from "@shared/types";
import { TagsServiceClient } from "./tagsServiceClient";
import { createServiceError, sanitizeInput } from "@shared/utils";
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
            content: sanitizedContent
        },
        include: {
            noteTags: true
        }
    })

    if(noteData.tagIds && note.noteTags.length == 0){
        if(authToken){
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
                isDeleted: false
            },
            include: {
                noteTags: true
            }
        })

        if(!note){
            throw createServiceError("Note not found", 404);
        }

        return note as Note
  }

  private async addTagsToNote(noteId: string, tagIds: string[]): Promise<void>{
    const noteTagData = tagIds.map((tagId) => ({
        noteId,
        tagId
    }));

    await prisma.noteTag.createMany({
        data: noteTagData,
        skipDuplicates: true
    })
  }
}
