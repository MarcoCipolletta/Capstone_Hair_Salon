import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthSvc } from '../auth.service';
import { iPasswordResetRequest } from '../interfaces/i-password-reset-request';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  form: FormGroup;
  constructor(
    private authSvc: AuthSvc,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private modalSvc: NgbModal
  ) {
    this.token = this.activeRoute.snapshot.params['token'] || '';

    this.form = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  token!: string;
  isLoadingLogin: boolean = false;

  resetPassword() {
    if (this.form.valid) {
      this.isLoadingLogin = true;
      const passwordResetRequest: iPasswordResetRequest = {
        password: this.form.value['newPassword'],
        token: this.token,
      };

      this.authSvc.resetPassword(passwordResetRequest).subscribe({
        next: (res) => {
          console.log(res);
          this.form.reset();
          this.isLoadingLogin = false;
          this.router.navigateByUrl('/auth');
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message =
            'Password aggiornata con successo';
        },
        error: (err) => {
          this.isLoadingLogin = false;
          this.router.navigateByUrl('/auth/forgot-password');
        },
      });
    } else {
      console.log('Form non valido');
    }
  }

  showPassword1 = false;
  showPassword2 = false;
  togglePassword1() {
    this.showPassword1 = !this.showPassword1;
  }
  togglePassword2() {
    this.showPassword2 = !this.showPassword2;
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('newPassword')?.value ===
      control.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
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
    } else if (control?.hasError('minlength')) {
      return 'La password deve avere almeno 8 caratteri';
    }

    return null;
  }
}
