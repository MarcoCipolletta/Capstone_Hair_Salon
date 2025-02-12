import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let modalSvc = inject(NgbModal);

  return next(req).pipe(
    catchError((err) => {
      console.log(err);

      // alert(err.error.message);
      const modalRef = modalSvc.open(ErrorModalComponent, {
        windowClass: 'custom-error-modal',
      });
      modalRef.componentInstance.message = err.error.message;
      throw new Error(err);
    })
  );
};
