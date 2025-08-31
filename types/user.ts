export interface User {
    username: string;
    email: string;
    avatar: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUser {
   email: string,
   name?: string;
}