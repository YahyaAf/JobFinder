export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}