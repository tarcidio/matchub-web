import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUp } from '../../../classes/signUp/sign-up';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){};

  private errorMessage: string = '';
  
  form = this.fb.group({
    email: ['', Validators.email],
    username: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15)
    ]],
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]],
    nickname: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    confirmPassword: ['', Validators.required]
  });

  get error(){
    return this.errorMessage;
  }

  get emailInvalid(){
    const control  = this.form.get('email');
    return control?.hasError('email') && control?.touched;
  }

  get usernameInvalid(){
    const control = this.form.get('username');
    return control?.errors && control.touched;
  }

  get firstNameInvalid(){
    const control = this.form.get('firstName');
    return control?.errors && control.touched;
  }

  get lastNameInvalid(){
    const control = this.form.get('lastName');
    return control?.errors && control.touched;
  }

  get nicknameInvalid(){
    const control = this.form.get('nickname');
    return control?.errors && control.touched;
  }

  get passwordInvalid(){
    const control = this.form.get('password');

    if(!control) return false;
    
    const isNull = !control.value;
    const hasUpperCase = !isNull && /[A-Z]+/.test(control.value);
    const hasLowerCase = !isNull && /[a-z]+/.test(control.value);
    const hasNumeric = !isNull && /[0-9]+/.test(control.value);
    const hasSpecial = !isNull && /[!@#$%^&*(),.?":{}|<>]+/.test(control.value);
    const isStrong = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return (control?.errors || !isStrong) && control?.touched;
  }

  get confirmPasswordInvalid(){
    const controlConfirm = this.form.get('confirmPassword');
    const controlPassword = this.form.get('password');

    if(!controlConfirm || !controlPassword) return false;
    
    const isTouched = controlConfirm.touched;
    const isRequiredError = controlConfirm.hasError('required') || controlPassword.hasError('required');
    const isEqualPassword = !controlConfirm.value || !controlPassword.value || 
                            (controlConfirm.value != controlPassword.value);

    return  (isEqualPassword || isRequiredError) && isTouched;
  }
  
  async onSubmit(){
    if(this.form.valid){
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
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred during registration.';
        }
      });
    }else{
      this.errorMessage = "Forms isn't valid";
    }
  }
}
