import type { NewNote, Note, NotesHttpResponse, NoteTagType } from "@/types/note";
import { nextServer } from "./api";
import type { LoginRequest, UpdateUser, User } from "@/types/user";

// отримати список нотаток
export const fetchNotes = async (query: string, page: number, tag?:NoteTagType): Promise<NotesHttpResponse> => {
    const endPoint = '/notes';

    const params = {
        search: query, /*query.trim() ? query.trim() : ' ',*/
        tag,
        page,
        perPage: 12,
        sortBy:'created',
    }

    const response = await nextServer.get<NotesHttpResponse>(endPoint, { params});
    
    return response.data;
}

//Отримати нотатку за ID
export const fetchNoteByID = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.get<Note>(endPoint);
        
    return response.data;
}

//створити нотатку
export const createNote = async(note: NewNote): Promise<Note> => {
    const endPoint = '/notes';

    const response = await nextServer.post<Note>(endPoint, note);
     
    return response.data;
}

//видалити нотатку
export const deleteNote = async(id: string):Promise<Note>  => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.delete<Note>(endPoint);

    return response.data;
}

//Реєстрація користувача
export const registerUser = async (userData: LoginRequest): Promise<User> => {
    const endPoint = '/auth/register';

    const response = await nextServer.post<User>(endPoint, userData);

    return response.data;
}

//отримати профіль користувача 
export const getUserProfile= async (): Promise<User> => {
    const endPoint = `/users/me`;
    
    const response = await nextServer.get<User>(endPoint);
        
    return response.data;
}

//Перевірка сессії користувача 
export const getSession = async() => {
    const endPoint =`/auth/session`
    
    const response = await nextServer.get(endPoint);
        
    return response.data;
}

//Аутентицікація користувача
export const loginUser = async (userData: LoginRequest): Promise<User> => {
    const endPoint = '/auth/login';

    const response = await nextServer.post<User>(endPoint, userData);

    return response.data;
}

//logoutUser
export const logoutUser = async (): Promise<void> => {
    const endPoint = '/auth/logout';

    await nextServer.post(endPoint);
}

// interface updMessage {
//     message: string,
// }

//Оновлення профілю
export const UpdateUserProfile = async (userData: UpdateUser): Promise<User> /*| updMessage>*/=>  {
    const endPoint = '/users/me';
    const response = await nextServer.patch<User>(endPoint, userData);
    return response.data;
}