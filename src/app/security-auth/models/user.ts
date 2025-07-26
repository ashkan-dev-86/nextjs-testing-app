import { AdapterUser } from "next-auth/adapters";

export interface IUserClaim extends AdapterUser {
    role: string;
}