import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalRoutingModule } from './modal-routing.module';
import { ModalUpdateComponent } from './modal-update/modal-update.component';
import { ModalExitComponent } from './modal-exit/modal-exit/modal-exit.component';


@NgModule({
  declarations: [ModalUpdateComponent, ModalExitComponent],
  imports: [
    CommonModule,
    ModalRoutingModule
  ],
  exports: [ModalUpdateComponent, ModalExitComponent],
})
export class ModalModule { }
