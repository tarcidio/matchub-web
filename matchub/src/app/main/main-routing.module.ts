import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'main',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      //Se quisessemos não fazer lazy loading, tirar o loadChildren e importar diretamente o container
      //Neste caso, os módulos intermediarios do Screen e Profile não seriam mais necessários
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'screen',
        loadChildren: () =>
          import('./screen/screen.module').then((m) => m.ScreenModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
