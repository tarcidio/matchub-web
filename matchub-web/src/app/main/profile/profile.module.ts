import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './containers/profile/profile.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "../../shared/modal/modal.module"; // Importar ReactiveFormsModule

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        ModalModule
    ]
})
export class ProfileModule {}
