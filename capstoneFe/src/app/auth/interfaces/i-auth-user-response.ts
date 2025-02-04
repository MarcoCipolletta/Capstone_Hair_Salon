import { iCustomerResponseForAuthResponse } from './i-customer-response-for-auth-response';
export interface iAuthUserResponse {
  id: string;
  username: string;
  email: string;
  avatar: string;
  customer?: iCustomerResponseForAuthResponse;
}
