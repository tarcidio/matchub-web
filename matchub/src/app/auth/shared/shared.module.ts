import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { FooterComponent } from './footer/footer.component';
import { ModalUpdateComponent } from './modal-update/modal-update.component';

@NgModule({
  declarations: [AuthFormComponent, FooterComponent, ModalUpdateComponent],
  imports: [CommonModule],
  //exports é importante para permitir que componentes de outro módulos
  // possam utilizar AuthFormComponent e não apenas componentes deste módulo
  exports: [AuthFormComponent, FooterComponent, ModalUpdateComponent],
})
export class SharedModule {}
