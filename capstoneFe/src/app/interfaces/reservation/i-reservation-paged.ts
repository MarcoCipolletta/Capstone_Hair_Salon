import { iReservationResponse } from './i-reservation-response';

export interface iReservationPaged {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  pageable: {
    unpaged: boolean;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
  };
  size: number;
  first: boolean;
  last: boolean;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  content: iReservationResponse[];
  empty: boolean;
}
