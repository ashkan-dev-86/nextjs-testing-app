import { Session } from 'next-auth';

export interface IAuthSession extends Session {
    user: IUser;
}

interface IUser {
    id: string;
    name?: string | null
    email?: string | null
    image?: string | null
    role: string;
}