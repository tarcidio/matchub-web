import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';

import { RegisterRoutingModule } from './register-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from "../../shared/modal/modal.module";


@NgModule({
    declarations: [RegisterComponent],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        MatIconModule,
        ModalModule
    ]
})
export class RegisterModule {}
