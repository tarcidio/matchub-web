import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ScreenModule } from './screen/screen.module';
import { ProfileModule } from './profile/profile.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    ScreenModule,
    ProfileModule,
    HomeModule,
  ],
})
export class MainModule {}
