import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggin()) {
    router.navigate(['main/home']);
    return false;
  } else {
    return true;
  }
};