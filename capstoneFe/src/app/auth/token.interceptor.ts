import { HttpInterceptorFn } from '@angular/common/http';
import { AuthSvc } from './auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  //uso inject per ottenere il service
  const authSvc = inject(AuthSvc);

  //prendo il valore di accesso (se c'è) da authSubject$
  let accessData = authSvc.userAuthSubject$.getValue();

  //se accessData non esiste mando la richiesta avanti
  if (!accessData) {
    return next(req);
  }
  //altrimenti clono la richiesta e aggiungo il token
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${accessData.token}`),
  });
  // mando quindi avanti la richiesta nuova con il token applicato
  return next(newRequest);
};
