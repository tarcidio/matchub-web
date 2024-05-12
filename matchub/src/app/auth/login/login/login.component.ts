import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../../classes/auth/login/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  private errorMessage: string = '';
  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get error() {
    return this.errorMessage;
  }

  async onSubmit() {
    if (this.form.valid) {
      const hubUser: Login = new Login(
        this.form.get('username')!.value!,
        this.form.get('password')!.value!
      );

      try {
        await this.authService.loginUser(hubUser);
        this.router.navigate(['/']);
      } catch (err: any) {
        this.errorMessage = err.message;
      }

      this.authService.loginUser(hubUser).subscribe({
        next: () => {
          this.router.navigate(['/main/home']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred during login.';
        }
      })
    }else{
      this.errorMessage = "Please enter a valid username and password.";
    }

    this.form.setValue({
      username: '',
      password: '',
    });
  }
}
