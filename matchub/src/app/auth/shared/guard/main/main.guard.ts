import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { inject } from '@angular/core';

export const mainGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggin()) {
    return true;
  } else {
    router.navigate(['auth/login']);
    return false;
  }
};

/*
CanActivateChildFn: type provided by Angular that defines the signature of a function that can be used
as a route guard for child routes. It ensures that the function has the correct signature to be used as a `CanActivateChild` guard.

New method of setting guard: now, instead of using a class, we can use a function to set
the guard. This function takes two parameters that, at the moment, may not seem very useful:
    1st `childRoute: ActivatedRouteSnapshot`: contains information about the child route being accessed.
    Some properties:
    a) **`childRoute.params`**: Contains the route parameters (e.g. `/user/:id`).
    b) **`childRoute.queryParams`**: Contains the URL query parameters.
    c) **`childRoute.data`**: Contains static data associated with the route, defined in the route configuration.
    d) **`childRoute.url`**: Contains the target URL of the route.
    e) **`childRoute.routeConfig`**: Contains the route configuration.

    2nd `state: RouterStateSnapshot`: contains the complete state of the router at the time of navigation.
    Some properties:
    a) **`state.url`**: Contains the complete navigation URL.
    b) **`state.root`**: Contains the root `ActivatedRouteSnapshot`, which can be used to access
    all active routes.
*/

/*
CanActivateFn: type provided by Angular that defines the signature of a function that can be used 
as a route guard. It ensures that the function has the correct signature to be used as a `CanActivate` guard

New method of defining guard: now, instead of using a class, we can use a function to define
the guard. This function takes two parameters that I don't particularly see much use for now:
   1ª `route: ActivatedRouteSnapshot`: contains information about the route being accessed.
   Some properties:
   a) **`route.params`**: Contains the route parameters (e.g. `/user/:id`).
   b) **`route.queryParams`**: Contains the query parameters of the URL.
   c) **`route.data`**: Contains static data associated with the route, defined in the route configuration.
   d) **`route.url`**: Contains the targeted URL of the route.
   e) **`route.routeConfig`**: Contains the route configuration.

   2ª `state: RouterStateSnapshot`: contains the complete state of the router at the time of navigation.
   Some properties:
   a) **`state.url`**: Contains the complete navigation URL.
   b) **`state.root`**: Contains the root `ActivatedRouteSnapshot`, which can be used to access
   all active routes.
*/
