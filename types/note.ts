export type NoteTagType = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Ideas' | 'Travel' | 'Finance' | 'Health' | 'Important' | 'Todo';

export interface Note {
    id: string; 
    title: string;
    content: string;
    tag: NoteTagType;
    createdAt: string;
    updatedAt: string;
}

export interface NewNote {
    title: string;
    content: string;
    tag: NoteTagType;
}

export interface NotesHttpResponse {
    notes: Note[];
    totalPages: number;
}