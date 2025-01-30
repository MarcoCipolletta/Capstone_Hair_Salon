import { iCustomerCreateRequest } from './i-customer-create-request';

export interface iRegisterRequest {
  username: string;
  email: string;
  password: string;
  customer: iCustomerCreateRequest;
  avatar?: string;
}
