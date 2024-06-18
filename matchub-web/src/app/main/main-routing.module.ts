import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { mainGuard } from '../auth/shared/guard/main/main.guard';

const routes: Routes = [
  {
    path: 'main',
    canActivate: [mainGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      // If we wanted to avoid lazy loading, remove loadChildren and directly import the container
      // In this case, the intermediate Screen and Profile modules would no longer be necessary
      {
        path: 'home',
        // Ensures that navigation between screens continues to respect the guard
        canActivate: [mainGuard],
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'screen',
        canActivate: [mainGuard],
        loadChildren: () =>
          import('./screen/screen.module').then((m) => m.ScreenModule),
      },
      {
        path: 'profile',
        canActivate: [mainGuard],
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
    ],
  },
  // Wildcard: if the user keeps trying to use urls without any pattern
  {path: '**', redirectTo: 'main'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
