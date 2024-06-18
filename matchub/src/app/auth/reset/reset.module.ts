import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetRoutingModule } from './reset-routing.module';
import { ResetComponent } from './reset/reset.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { ModalModule } from '../../shared/modal/modal.module';

@NgModule({
  declarations: [ResetComponent],
  imports: [
    CommonModule,
    ResetRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule
  ],
})
export class ResetModule {}
