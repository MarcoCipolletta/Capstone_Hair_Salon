import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthSvc } from '../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  constructor(
    private authSvc: AuthSvc,
    private router: Router,
    private modalSvc: NgbModal
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  isLoadingLogin: boolean = false;

  resetPassword() {
    if (this.form.valid) {
      this.isLoadingLogin = true;
      this.authSvc.sendRequestPasswordReset(this.form.value).subscribe({
        next: (res) => {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.isLoadingLogin = false;
          setTimeout(() => {
            this.modalSvc.dismissAll();
            this.router.navigate(['/auth']);
          }, 1500);
        },
        error: (err) => {
          this.isLoadingLogin = false;
        },
      });
    }
  }

  isInvalidTouched(fieldName: string) {
    return (
      this.form.get(fieldName)?.invalid && this.form.get(fieldName)?.touched
    );
  }

  getError(fieldName: string) {
    const control = this.form.get(fieldName);
    if (control?.errors!['required']) {
      return 'Campo obbligatorio';
    } else if (control?.errors!['email']) {
      return 'Email non valida';
    }

    return null;
  }
}
