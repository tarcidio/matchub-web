import { Component, OnInit } from '@angular/core';
import { HubUserDetails } from '../../../../classes/hub-user/hub-user-details/hub-user-details';
import { Observable, map, switchMap, take } from 'rxjs';
import { HubUserService } from '../../../shared/services/hub-user/hub-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/shared/service/auth.service';
import { HubUserBase } from '../../../../classes/hub-user/hub-user-base/hub-user-base';
import { ChangePassword } from '../../../../classes/auth/change-password/change-password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(
    private hubUserService: HubUserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.hubUserService.getHubUser().subscribe({
      next: (hubUser) => {
        if (hubUser) {
          this.formPersonalInformation.patchValue({
            firstName: hubUser.firstname,
            lastName: hubUser.lastname,
            email: '',
          });

          this.formUserInformation.patchValue({ nickName: hubUser.nickname });
        }
      },
    });
  }

  public get username$() {
    return this.hubUserService.getUserNameHubUser();
  }

  public get email$(): Observable<string> {
    return this.hubUserService
      .getEmailHubUser()
      .pipe(map((email) => this.maskEmail(email)));
  }

  private maskEmail(email: string): string {
    const atPosition = email.indexOf('@');

    // Verifica se o '@' foi encontrado e se há pelo menos três caracteres antes dele
    if (atPosition === -1 || atPosition < 3) {
      return email;
    }

    // Mantém os três primeiros caracteres, substitui o restante antes do '@' por asteriscos
    const maskedSection = '*'.repeat(atPosition - 3);
    return `${email.substring(0, 3)}${maskedSection}${email.substring(
      atPosition
    )}`;
  }

  /* MANAGE UPDATES */

  isModalUpdate: boolean = false;
  titleModal: string | undefined;
  messageModal: string | undefined;

  private activateModalUpdate(
    type: string = 'sucess',
    message: string = 'Your information has been updated successfully'
  ): void {
    this.isModalUpdate = true;
    if (type === 'fail') {
      this.titleModal = 'Error updating information';
      this.messageModal = message;
    } else if (type === 'sucess') {
      this.titleModal = 'Change Made';
      this.messageModal = message;
    }
  }

  public disableModalUpdate(): void {
    this.isModalUpdate = false;
  }

  private updateHubUser(
    newNickName?: string,
    newFirstName?: string,
    newLastName?: string,
    newEmail?: string
  ): void {
    this.hubUserService
      .getHubUser()
      .pipe(
        take(1), // Avoid recursion
        map((hubUser: HubUserDetails) => {
          return new HubUserBase(
            newNickName || hubUser.nickname,
            newFirstName || hubUser.firstname,
            newLastName || hubUser.lastname,
            newEmail || hubUser.email,
            hubUser.region
          );
        }),
        switchMap((hubUser: HubUserBase) =>
          this.hubUserService.updateHubUser(hubUser)
        )
      )
      .subscribe({
        next: () => {
          this.activateModalUpdate();
        },
        error: (err) => {
          this.activateModalUpdate('fail', err.message);
        },
      });
  }

  formUserInformation: FormGroup = this.fb.group({
    nickName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(15)],
    ],
  });

  public updateUserInformation(): void {
    if (this.formUserInformation.valid) {
      let newNickName: string | undefined =
        this.formUserInformation.get('nickName')?.value;
      let newFirstName: string | undefined = undefined;
      let newLastName: string | undefined = undefined;
      let newEmail: string | undefined = undefined;
      this.updateHubUser(newNickName, newFirstName, newLastName, newEmail);
    } else {
      this.activateModalUpdate(
        'fail',
        'Please choose a valid nickname (2-15 characters).'
      );
    }
  }

  formPersonalInformation: FormGroup = this.fb.group({
    email: ['', Validators.email],
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
  });

  get firstNameInvalid() {
    const control = this.formPersonalInformation.get('firstName');
    return control?.errors;
  }

  get lastNameInvalid() {
    const control = this.formPersonalInformation.get('lastName');
    return control?.errors;
  }

  get emailInvalid() {
    const control = this.formPersonalInformation.get('email');
    return control?.hasError('email');
  }

  public updatePersonalInformation(): void {
    if (this.formPersonalInformation.valid) {
      let newNickName: string | undefined = undefined;
      let newFirstName: string | undefined =
        this.formPersonalInformation.get('firstName')?.value;
      let newLastName: string | undefined =
        this.formPersonalInformation.get('lastName')?.value;
      let newEmail: string | undefined =
        this.formPersonalInformation.get('email')?.value;
      this.updateHubUser(newNickName, newFirstName, newLastName, newEmail);
    } else {
      if (this.emailInvalid)
        this.activateModalUpdate('fail', 'Please enter a valid email address.');
      else if (this.lastNameInvalid)
        this.activateModalUpdate(
          'fail',
          'Please enter a valid last name (2-30 characters).'
        );
      else if (this.firstNameInvalid)
        this.activateModalUpdate(
          'fail',
          'Please enter a valid first name (2-30 characters).'
        );
    }
  }

  invalidChnagePassword: boolean = false;
  formChangePassword: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  get passwordInvalid() {
    const control = this.formChangePassword.get('newPassword');

    if (!control) return false;

    const isNull = !control.value;
    const hasUpperCase = !isNull && /[A-Z]+/.test(control.value);
    const hasLowerCase = !isNull && /[a-z]+/.test(control.value);
    const hasNumeric = !isNull && /[0-9]+/.test(control.value);
    const hasSpecial = !isNull && /[!@#$%^&*(),.?":{}|<>]+/.test(control.value);
    const isStrong = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return control?.errors || !isStrong;
  }

  get confirmPasswordInvalid() {
    const controlConfirm = this.formChangePassword.get('confirmPassword');
    const controlPassword = this.formChangePassword.get('newPassword');

    if (!controlConfirm || !controlPassword) return false;

    const isRequiredError =
      controlConfirm.hasError('required') ||
      controlPassword.hasError('required');
    const isEqualPassword =
      !controlConfirm.value ||
      !controlPassword.value ||
      controlConfirm.value !== controlPassword.value;

    return isEqualPassword || isRequiredError;
  }

  public changePassword(): void {
    if (this.passwordInvalid) {
      this.activateModalUpdate(
        'fail',
        'Password must include uppercase, lowercase, number, special character, and be at least 8 characters long.'
      );
    } else if (this.confirmPasswordInvalid) {
      this.activateModalUpdate(
        'fail',
        'Password confirmation does not match the password.'
      );
    } else if (this.formChangePassword.valid) {
      let currentPassword: string =
        this.formChangePassword.get('oldPassword')?.value;
      let newPassword: string =
        this.formChangePassword.get('newPassword')?.value;
      let confirmationPassword: string =
        this.formChangePassword.get('confirmPassword')?.value;
      this.hubUserService
        .changePassword(
          new ChangePassword(currentPassword, newPassword, confirmationPassword)
        )
        .subscribe({
          next: () => {
            this.activateModalUpdate();
          },
          error: (err) => {
            this.activateModalUpdate('fail', err.message);
          },
        });
    } else {
      this.activateModalUpdate('fail', 'Unexpected error.');
    }
  }

  isModalExit: boolean = false;
  public activateModalExit(): void {
    this.isModalExit = true;
  }

  public confirmExit(): void {
    this.authService.logout().subscribe();
  }

  public disableModalExit(): void {
    this.isModalExit = false;
  }
}
