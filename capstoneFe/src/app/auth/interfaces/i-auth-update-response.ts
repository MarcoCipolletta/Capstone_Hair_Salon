import { iAccess } from './i-access';
import { iAuthUserResponse } from './i-auth-user-response';

export interface iAuthUpdateResponse {
  authResponse: iAccess;
  authUserResponse: iAuthUserResponse;
}
