import type { Note, NotesHttpResponse, NoteTagType } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";

// отримати список нотаток
export const fetchNotesServer = async (query: string, page: number, tag?:NoteTagType): Promise<NotesHttpResponse> => {
    const endPoint = '/notes';

    const params = {
        search: query, /*query.trim() ? query.trim() : ' ',*/
        tag,
        page,
        perPage: 12,
    }

    const response = await nextServer.get<NotesHttpResponse>(endPoint, { params});
    
    return response.data;
}

//Отримати нотатку за ID
export const fetchNoteByIDServer = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.get<Note>(endPoint);
        
    return response.data;
}

//Отримати профіль користувача
export const getUserProfileServer = async (): Promise<User> => {
    const endPoint = `/users/me`;
    const cookieStore = cookies();

    const response = await nextServer.get<User>(endPoint, { headers: { Cookie: cookieStore.toString(), }, });
        
    return response.data;
}

//Перевірка сессії користувача 
export const getSessionServer = async() => {
    const endPoint =`/auth/session`
    const cookieStore = cookies();
    
    const response = await nextServer.get(endPoint, { headers: { Cookie: cookieStore.toString(), }, });
        
    return response.data;
}