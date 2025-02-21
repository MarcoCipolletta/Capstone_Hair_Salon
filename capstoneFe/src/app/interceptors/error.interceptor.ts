import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs';
import { ModalComponent } from '../shared/modal/modal.component';
import { AuthSvc } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let modalSvc = inject(NgbModal);
  let authSvc = inject(AuthSvc);

  return next(req).pipe(
    catchError((err) => {
      setTimeout(() => {
        if (err.status === 401) {
          authSvc.logout();

          const modalRef = modalSvc.open(ModalComponent, {
            windowClass: 'custom-error-modal',
          });
          modalRef.componentInstance.message =
            'Sessione scaduta. Effettua nuovamente il login.';
        } else {
          const modalRef = modalSvc.open(ModalComponent, {
            windowClass: 'custom-error-modal',
          });

          modalRef.componentInstance.message =
            err.error.message || 'Si è verificato un errore.';
        }
      }, 100);
      throw new Error(err);
    })
  );
};
