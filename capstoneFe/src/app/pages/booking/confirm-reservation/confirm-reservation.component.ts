import { Component, inject } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { iReservationCreateRequest } from '../../../interfaces/reservation/i-reservation-create-request';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSvc } from '../../../auth/auth.service';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-confirm-reservation',
  templateUrl: './confirm-reservation.component.html',
  styleUrl: './confirm-reservation.component.scss',
})
export class ConfirmReservationComponent {
  constructor(
    private reservationSvc: ReservationsService,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthSvc,
    protected timeConversionSvc: TimeConversionSvcService,
    private modalSvc: NgbModal
  ) {}

  reservation!: iReservationCreateRequest;

  ngOnInit(): void {
    if (
      this.authSvc.isLogged$.getValue() &&
      sessionStorage.getItem('newReservation')
    ) {
      this.reservation = JSON.parse(sessionStorage.getItem('newReservation')!);
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: 1 },
      });
    }
  }

  sendReservation() {
    this.reservationSvc.makeReservation(this.reservation).subscribe({
      next: (res) => {
        sessionStorage.removeItem('newReservation');
        sessionStorage.removeItem('selectedServices');

        if (res.message === 'Prenotazione confermata') {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
        } else {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-warning-modal',
          });
          modalRef.componentInstance.message = res.message;
        }
        setTimeout(() => {
          this.router.navigate(['/profile/myReservations']);
        }, 1500);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  get totalPrice() {
    return this.reservation.salonServices.reduce(
      (acc, service) => acc + service.price,
      0
    );
  }
  get totalDuration() {
    let totalTime = this.reservation.salonServices.reduce(
      (acc, service) => acc + service.duration,
      0
    );
    return this.timeConversionSvc.secondsToDuration(totalTime);
  }
}
