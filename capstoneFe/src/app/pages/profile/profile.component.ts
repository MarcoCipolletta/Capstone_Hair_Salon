import { Component } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { iAuthUserResponse } from '../../auth/interfaces/i-auth-user-response';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(
    private authSvc: AuthSvc,
    private fb: FormBuilder,
    private modalSvc: NgbModal
  ) {}

  user!: iAuthUserResponse;
  form!: FormGroup;
  passForm!: FormGroup;

  isEditing: boolean = false;
  isEditingPassword: boolean = false;

  ngOnInit(): void {
    this.authSvc.getMe().subscribe((user) => {
      this.user = user;
      if (!this.user.customer) {
        this.form = this.fb.group({
          id: [this.user.id, [Validators.required]],
          username: [this.user.username, [Validators.required]],
          email: [this.user.email, [Validators.required]],
          avatar: [this.user.avatar, [Validators.required]],
          role: [this.user.role, [Validators.required]],
        });
      } else {
        this.form = this.fb.group({
          id: [this.user.id, [Validators.required]],
          username: [this.user.username, [Validators.required]],
          email: [
            this.user.email,
            [
              Validators.required,
              Validators.email,
              Validators.pattern(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
              ),
            ],
          ],
          role: [this.user.role, [Validators.required]],
          avatar: [this.user.avatar, [Validators.required]],
          customer: this.fb.group({
            id: [this.user.customer.id, [Validators.required]],
            name: [this.user.customer.name, [Validators.required]],
            surname: [this.user.customer.surname, [Validators.required]],
            dateOfBirth: [
              this.user.customer.dateOfBirth,
              [Validators.required],
            ],
            phoneNumber: [
              this.user.customer.phoneNumber,
              [Validators.required],
            ],
          }),
        });
      }
    });
  }

  enableEditing() {
    if (this.isEditing) {
    }
    if (this.isEditingPassword) {
      this.enableEditingPassword();
    } else {
      this.isEditing = !this.isEditing;
    }
  }

  enableEditingPassword() {
    this.isEditingPassword = !this.isEditingPassword;
    if (this.isEditingPassword) {
      this.passForm = this.fb.group(
        {
          oldPassword: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(8)]],
          confirmNewPassword: ['', [Validators.required]],
        },
        {
          validators: this.passwordMatchValidator,
        }
      );
    }
  }

  showPassword1 = false;
  showPassword2 = false;
  showPassword3 = false;
  togglePassword1() {
    this.showPassword1 = !this.showPassword1;
  }
  togglePassword2() {
    this.showPassword2 = !this.showPassword2;
  }
  togglePassword3() {
    this.showPassword3 = !this.showPassword3;
  }

  isInvalidTouched(formGroup: FormGroup | any, fieldName: string) {
    const control = formGroup.get(fieldName);
    return control && control.invalid && control.touched;
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
  getErrorPass(fieldName: string) {
    const control = this.passForm.get(fieldName);
    if (control?.errors!['required']) {
      return 'Campo obbligatorio';
    } else if (control?.hasError('minlength')) {
      return 'La password deve avere almeno 8 caratteri';
    }

    return null;
  }

  save() {
    this.authSvc.update(this.form.value).subscribe((data) => {
      this.user = data.authUserResponse;
      const modalRef = this.modalSvc.open(ModalComponent, {
        windowClass: 'custom-success-modal',
      });
      modalRef.componentInstance.message = 'Dati modificati con successo';
      this.isEditing = false;
    });
  }

  savePassword() {
    this.authSvc.changePassword(this.passForm.value).subscribe((data) => {
      this.isEditingPassword = false;
      this.isEditing = false;
      const modalRef = this.modalSvc.open(ModalComponent, {
        windowClass: 'custom-success-modal',
      });
      modalRef.componentInstance.message = 'Password modificata con successo';
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('newPassword')?.value ===
      control.get('confirmNewPassword')?.value
      ? null
      : { passwordMismatch: true };
  }
}
