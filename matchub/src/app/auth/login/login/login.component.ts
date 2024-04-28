import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private fb: FormBuilder) {}

  form : FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
}
