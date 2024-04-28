import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './containers/profile/profile.component';
import { InfoComponent } from './components/info/info.component';


@NgModule({
  declarations: [
    ProfileComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
