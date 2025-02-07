import { iAuthUserResponse } from './i-auth-user-response';

export interface iAccess {
  token: string;
  user: iAuthUserResponse;
}
