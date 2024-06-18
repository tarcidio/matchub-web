import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';

@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ConfirmEmailModule { }
