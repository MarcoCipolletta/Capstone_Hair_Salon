import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthSvc } from '../auth.service';
import { Router } from '@angular/router';
import { iRegisterRequest } from '../interfaces/i-register-request';
import { iCustomerCreateRequest } from '../interfaces/i-customer-create-request';
import { NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form!: FormGroup;
  customer: iCustomerCreateRequest = {
    name: '',
    surname: '',
    dateOfBirth: new Date(),
    phoneNumber: '',
  };
  authUser: iRegisterRequest = {
    username: '',
    email: '',
    password: '',
    customer: this.customer,
  };
  currentPage: number = 1;
  progress: number = 0;
  constructor(
    private progressbarConfig: NgbProgressbarConfig,
    private authSvc: AuthSvc,
    private router: Router,
    private modalSvc: NgbModal
  ) {
    progressbarConfig.max = 100;
    progressbarConfig.striped = true;
    progressbarConfig.animated = true;
    progressbarConfig.type = 'success';
    progressbarConfig.height = '1rem';
    this.form = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        customer: new FormGroup({
          name: new FormControl('', [Validators.required]),
          surname: new FormControl('', [Validators.required]),
          dateOfBirth: new FormControl('', [Validators.required]),
          phoneNumber: new FormControl('', [Validators.required]),
        }),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
    this.form.valueChanges.subscribe(() => this.updateProgress());
  }
  isLoadingRegister: boolean = false;

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value ===
      control.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  register() {
    if (this.form.valid) {
      this.isLoadingRegister = true;
      this.authUser = this.form.value;
      this.authUser.email = this.authUser.email.toLowerCase();
      this.authSvc.register(this.authUser).subscribe({
        next: (res) => {
          console.log(res);
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.isLoadingRegister = false;
          setTimeout(() => {
            this.modalSvc.dismissAll();
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (err) => {
          this.isLoadingRegister = false;
        },
      });
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

  isInvalidTouched(fieldName: string) {
    return (
      this.form.get(fieldName)?.invalid && this.form.get(fieldName)?.touched
    );
  }

  getError(fieldName: string) {
    const control = this.form.get(fieldName);
    if (control?.errors!['required']) {
      return 'Campo obbligatorio';
    } else if (control?.hasError('pattern') && fieldName === 'email') {
      return 'Formato email non valido, deve includere un dominio corretto (es. nome@email.com)';
    } else if (control?.errors!['email']) {
      return 'Email non valida';
    } else if (control?.hasError('minlength')) {
      return 'La password deve avere almeno 8 caratteri';
    }

    return null;
  }

  updateProgress() {
    const totalFields = 8;
    let validFields = 0;

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          if (control.get(subKey)?.valid) {
            validFields++;
          }
        });
      } else {
        if (key === 'confirmPassword') {
          const password = this.form.get('password')?.value;
          const confirmPassword = control?.value;

          if (password === confirmPassword && control?.valid) {
            validFields++;
          }
        } else if (control?.valid) {
          validFields++;
        }
      }
    });

    this.progress = Math.round((validFields / totalFields) * 100);
  }
}
