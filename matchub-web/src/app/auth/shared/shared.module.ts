import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule],
  //exports é importante para permitir que componentes de outro módulos
  // possam utilizar AuthFormComponent e não apenas componentes deste módulo
  exports: [FooterComponent],
})
export class SharedModule {}
