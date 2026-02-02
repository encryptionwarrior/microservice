import { CreateNoteRequest, Note } from "@shared/types";
import { TagsServiceClient } from "./tagsServiceClient";


export class NotesService {
    private tagServiceClient: TagsServiceClient;
    constructor(){
        this.tagServiceClient = new TagsServiceClient();
    }

    async createNote(userId: string, noteData: CreateNoteRequest, authToken?: string): Promise<Note>{


        const sanitizedTitle = sanitize

    }
}