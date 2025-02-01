import { Component, inject } from '@angular/core';
import { AuthSvc } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { iLoginRequest } from '../interfaces/i-login-request';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  returnUrl: string = '/';
  constructor() {
    this.form = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  private authSvc = inject(AuthSvc);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isLoadingLogin: boolean = false;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    if (this.form.valid) {
      this.isLoadingLogin = true;

      const loginRequestData: iLoginRequest = this.form.value;
      this.authSvc.login(loginRequestData).subscribe({
        next: (res) => {
          console.log(res);

          setTimeout(() => {
            this.isLoadingLogin = false;
            this.router.navigateByUrl(this.returnUrl);
          }, 1500);
        },
        error: (err) => {
          this.isLoadingLogin = false;
          alert(err.error.message);
        },
      });
    } else {
      console.log('Form non valido');
    }
  }

  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isInvalidTouched(fieldName: string) {
    return (
      this.form.get(fieldName)?.invalid && this.form.get(fieldName)?.touched
    );
  }
}
