import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot/forgot.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule

import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from "../../shared/modal/modal.module";



@NgModule({
    declarations: [
        ForgotComponent
    ],
    imports: [
        CommonModule,
        ForgotRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        MatIconModule,
        ModalModule
    ]
})
export class ForgotModule { }
