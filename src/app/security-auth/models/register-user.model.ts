import { Role } from "../enums/roles";
import { RegisterInput } from "../validations/auth";

export interface IRegisterUser extends RegisterInput {
    role?: Role;
}

export interface ICreateUserResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  error?: string;
}