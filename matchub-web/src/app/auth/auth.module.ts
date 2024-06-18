import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { ForgotModule } from './forgot/forgot.module';
import { ResetModule } from './reset/reset.module';
import { ConfirmEmailModule } from './confirm-email/confirm-email.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RegisterModule,
    LoginModule,
    ForgotModule,
    ResetModule,
    ConfirmEmailModule,
  ],
})
export class AuthModule {}
