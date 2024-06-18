import { Component, ViewChild } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { SignUp } from '../../../shared/classes/auth/signUp/sign-up';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ModalUpdateComponent } from '../../../shared/modal/modal-update/modal-update.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public isLoading: boolean = false;
  private errorMessage: string = '';
  @ViewChild(ModalUpdateComponent) modal: ModalUpdateComponent | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  form = this.fb.group({
    email: ['', Validators.email],
    username: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(15)],
    ],
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
    nickname: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(15)],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  get error() {
    return this.errorMessage;
  }

  get emailInvalid() {
    const control = this.form.get('email');
    return control?.hasError('email') && control?.touched;
  }

  get usernameInvalid() {
    const control = this.form.get('username');
    return control?.errors && control.touched;
  }

  get firstNameInvalid() {
    const control = this.form.get('firstName');
    return control?.errors && control.touched;
  }

  get lastNameInvalid() {
    const control = this.form.get('lastName');
    return control?.errors && control.touched;
  }

  get nicknameInvalid() {
    const control = this.form.get('nickname');
    return control?.errors && control.touched;
  }

  get passwordInvalid() {
    const control = this.form.get('password');

    if (!control) return false;

    const isNull = !control.value;
    const hasUpperCase = !isNull && /[A-Z]+/.test(control.value);
    const hasLowerCase = !isNull && /[a-z]+/.test(control.value);
    const hasNumeric = !isNull && /[0-9]+/.test(control.value);
    const hasSpecial = !isNull && /[!@#$%^&*(),.?":{}|<>]+/.test(control.value);
    const isStrong = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return (control?.errors || !isStrong) && control?.touched;
  }

  get confirmPasswordInvalid() {
    const controlConfirm = this.form.get('confirmPassword');
    const controlPassword = this.form.get('password');

    if (!controlConfirm || !controlPassword) return false;

    const isTouched = controlConfirm.touched;
    const isRequiredError =
      controlConfirm.hasError('required') ||
      controlPassword.hasError('required');
    const isEqualPassword =
      !controlConfirm.value ||
      !controlPassword.value ||
      controlConfirm.value !== controlPassword.value;

    return (isEqualPassword || isRequiredError) && isTouched;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true; // Inicia o carregamento
      const hubUser: SignUp = new SignUp(
        // It's need afirm that isn't null
        this.form.get('email')!.value!,
        this.form.get('firstName')!.value!,
        this.form.get('lastName')!.value!,
        this.form.get('nickname')!.value!,
        this.form.get('username')!.value!,
        this.form.get('password')!.value!
      );

      this.authService.registerUser(hubUser).subscribe({
        next: () => {
          this.isLoading = false; // Termina o carregamento
          this.modal!.activateModalUpdate(
            'Email Confirmation Required',
            'Thank you for registering! \n\n' +
              'We have sent a confirmation email to your registered address. ' +
              'Please check your inbox to activate your account.\n\n' +
              "If you don't receive the email shortly, check your spam or junk mail folder.\n\n" +
              "It's important to confirm your email to access all account features. " +
              'If you need help, please contact User Support.',
            'auth/login',
            'Back to login'
          );
        },
        error: (err) => {
          this.isLoading = false; // Termina o carregamento
          this.modal!.activateModalUpdate(
            'Username or Email Already Registered',
            'The email or username provided is already associated with an existing account.\n\n' +
              'If you think this is a mistake or if you have forgotten your password, ' +
              'try resetting it through our password recovery options. \n\n' +
              'If you do not remember creating an account or need further assistance, ' +
              'check your previous emails or contact User Support. \n\n' +
              'We appreciate your understanding and are here to help.',
            'auth/login',
            'Back to login'
          );
        },
      });
    } else {
      this.errorMessage = 'Please enter a valid information.';
    }
  }
}
