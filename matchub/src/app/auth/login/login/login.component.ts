import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  private errorMessage: string = '';
  form : FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get error(){
    return this.errorMessage;
  }

  async onSubmit(){
    if(this.form.valid){
      const {username, password} = this.form.value;
      try{
        await this.authService.loginUser(username, password);
        this.router.navigate(['/'])
      }catch(err: any){
        this.errorMessage = err.message;
      }
    }

    this.form.setValue({
      username: '',
      password: ''
    });
  }

}