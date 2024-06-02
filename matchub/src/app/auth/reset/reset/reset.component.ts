import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HubUserService } from '../../../main/shared/services/hub-user/hub-user.service';
import { ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../../../classes/auth/reset-password/reset-password';
import { switchMap, tap } from 'rxjs';
import { ModalUpdateComponent } from '../../shared/modal-update/modal-update.component';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss',
})
export class ResetComponent {
  private errorMessage: string = '';
  @ViewChild(ModalUpdateComponent) modal: ModalUpdateComponent | undefined;

  constructor(
    private fb: FormBuilder,
    private hubUserService: HubUserService,
    private route: ActivatedRoute
  ) {}

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  get error() {
    return this.errorMessage;
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

  public changePassword(): void {
    if (this.form.valid) {
      let newPassword: string = this.form.get('password')?.value;
      let confirmationPassword: string =
        this.form.get('confirmPassword')?.value;
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.hubUserService.resetPassword(
              new ResetPassword(newPassword, confirmationPassword),
              params.get('token')!
            )
          )
        )
        .subscribe({
          next: () => {
            this.modal!.activateModalUpdate(
              'Change Made',
              'Your password has been changed successfully!',
              'auth/login',
              'Back to Login'
            );
          },
          error: (err) => {
            this.modal!.activateModalUpdate(
              'Something is wrong',
              'Some error happened and your password has not been changed yet.' + 
              ' We will direct you to login. Error: ' + err.message,
              'auth/login',
              'Back to Login'
            );
          },
        });
    } else {
      this.errorMessage = 'Please enter a valid information.';
    }
  }
}
