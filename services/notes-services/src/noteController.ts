import { asyncHandler } from "@shared/middleware";
import { createErrorResponse } from "@shared/utils";
import { Request, Response } from "express";


export const createNote = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json(createErrorResponse("Unauthorized"));
    }

    const authHeader = req.headers.authorization;
    const authToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    // const note = await noteService

    

})