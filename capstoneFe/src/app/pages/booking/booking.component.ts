import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSvc } from '../../auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  page = 1;
  isLogged = false;

  constructor(
    private authSvc: AuthSvc,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.queryParams, this.authSvc.$isLogged]).subscribe(
      ([params, logged]) => {
        this.isLogged = logged;

        let requestedPage = +params['page'] || 1;

        if (requestedPage === 3 && !this.isLogged) {
          if (sessionStorage.getItem('newReservation')) {
            requestedPage = 4;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: 4 },
            });
          } else {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: 1 },
            });
          }
        }

        this.page = requestedPage;
      }
    );
  }

  onPageChange(page: number): void {
    if (page === 3 && !this.isLogged) {
      page = 4;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      if (this.page === 4) {
        this.page = 2;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.page },
        });
        return;
      }
      let newPage = this.page - 1;

      if (newPage === 3 && !this.isLogged) {
        newPage = 4;
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/booking?page=3' },
    });
  }
}
