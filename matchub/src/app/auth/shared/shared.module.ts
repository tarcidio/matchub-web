import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [AuthFormComponent, FooterComponent],
  imports: [CommonModule],
  //exports é importante para permitir que componentes de outro módulos
  // possam utilizar AuthFormComponent e não apenas componentes deste módulo
  exports: [AuthFormComponent, FooterComponent],
})
export class SharedModule {}
