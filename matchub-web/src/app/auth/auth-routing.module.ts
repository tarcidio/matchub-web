import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth/auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
      {
        path: 'forgot',
        loadChildren: () =>
          import('./forgot/forgot.module').then(
            (m) => m.ForgotModule
          ),
      },
      {
        path: 'reset',
        loadChildren: () =>
          import('./reset/reset.module').then(
            (m) => m.ResetModule
          ),
      },
      {
        path: 'confirm',
        loadChildren: () =>
          import('./confirm-email/confirm-email.module').then(
            (m) => m.ConfirmEmailModule
          ),
      },
      { path: '**', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
