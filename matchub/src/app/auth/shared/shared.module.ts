import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './auth-form/auth-form.component';

@NgModule({
  declarations: [AuthFormComponent],
  imports: [CommonModule],
  //exports é importante para permitir que componentes de outro módulos
  // possam utilizar AuthFormComponent e não apenas componentes deste módulo
  exports: [AuthFormComponent],
})
export class SharedModule {}
