import { Component, inject } from '@angular/core';
import { iCustomerResponseForAdmin } from '../../../interfaces/customer/i-customer-response-for-admin';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeConversionSvcService } from '../../../services/time-conversion-svc.service';
import { iSalonServiceResponse } from '../../../interfaces/salonServices/i-salon-service-response';

@Component({
  selector: 'app-info-customer',
  templateUrl: './info-customer.component.html',
  styleUrl: './info-customer.component.scss',
})
export class InfoCustomerComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerSvc: CustomerService,
    protected timeConverter: TimeConversionSvcService
  ) {}

  customer!: iCustomerResponseForAdmin;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.customerSvc.getCustomerById(id).subscribe((res) => {
        this.customer = res;
        console.log(res);

        this.customer.reservations.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      });
    } else {
      this.router.navigate(['/salonManagement/customers']);
    }
  }

  setStatus(status: string) {
    if (status === 'PENDING') {
      return 'Da confermare';
    } else if (status === 'CONFIRMED') {
      return 'Confermato';
    } else if (status === 'COMPLETED') {
      return 'Completato';
    } else if (status === 'CANCELLED') {
      return 'Annullato';
    }
    return '';
  }

  getTotalDuration(services: iSalonServiceResponse[]) {
    let total = services.reduce((a, b) => a + b.duration, 0);
    return this.timeConverter.secondsToDuration(total);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  }

  goBack() {
    this.router.navigate(['/salonManagement/customers']);
  }

  get lastSeen() {
    if (this.customer.reservations.length > 0) {
      let completedReservations = this.customer.reservations.filter(
        (r) => r.status === 'COMPLETED'
      );
      if (completedReservations.length > 0) {
        let lastCompletedReservation = completedReservations.reduce(
          (latest, current) =>
            new Date(current.date) > new Date(latest.date) ? current : latest,
          completedReservations[0]
        );
        return new Intl.DateTimeFormat('it-IT').format(
          new Date(lastCompletedReservation.date)
        );
      }
      return 'Nessun appuntamento effettuato';
    } else return 'Nessun appuntamento effettuato';
  }
}
