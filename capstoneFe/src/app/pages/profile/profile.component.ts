import { Component, inject } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { iAuthUserResponse } from '../../auth/interfaces/i-auth-user-response';
import { combineLatest } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authSvc = inject(AuthSvc);
  private fb = inject(FormBuilder);

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

  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
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
    console.log('QUI');

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
      console.log(data);
      this.user = data.authUserResponse;

      this.isEditing = false;
    });
  }

  savePassword() {
    this.authSvc.changePassword(this.passForm.value).subscribe((data) => {
      console.log(data);
      this.isEditingPassword = false;
      this.isEditing = false;
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('newPassword')?.value ===
      control.get('confirmNewPassword')?.value
      ? null
      : { passwordMismatch: true };
  }
}
