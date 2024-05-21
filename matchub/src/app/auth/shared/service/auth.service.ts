import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { SignUp } from '../../../classes/auth/signUp/sign-up';
import { AuthResponse } from '../../../classes/auth/auth-response/auth-response';
import { Login } from '../../../classes/auth/login/login';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
// HttpInterceptor: interface that allows you to intercept and modify HTTP requests and responses
export class AuthService implements HttpInterceptor {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for refreshing tokens
  private readonly REFRESH_TOKEN_URL = `${this.API_URL}auth/refresh-token`;
  // URL for user registration
  private readonly REGISTER_URL = `${this.API_URL}auth/register`;
  // URL for user login
  private readonly LOGIN_URL = `${this.API_URL}auth/authenticate`;
  // URL for user logout
  private readonly LOGOUT_URL = `${this.API_URL}auth/logout`;

  constructor(private http: HttpClient, private router: Router) {}

  /* LOGIN, LOGOUT AND TOKEN MANAGEMENT */

  // Check if the user is logged in by verifying the presence of an access token in local storage
  public isLoggin(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Log out the user by removing the access token from local storage and reloading the page
  private logoutActions(): void {
    localStorage.clear();
    // criar um modal e deixar ele por 1 segundo dizendo que precisa entrar e novo
    this.router.navigate(['auth/login']);
  }

  // Save the access token and nickname to local storage and store
  private saveToken(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
  }

  /* LOGIN, SIGNUP AND LOGOUT MANAGEMENT */

  // Register a new user
  public registerUser(hubUser: SignUp): Observable<void> {
    return this.http
      .post<AuthResponse>(this.REGISTER_URL, hubUser, {
        withCredentials: true,
      })
      .pipe(
        map((authResponse) => this.saveToken(authResponse)),
        catchError(this.handleError.bind(this, 'register'))
      );
  }

  // Log in an existing user
  public loginUser(hubUser: Login): Observable<void> {
    return (
      this.http
        // Both front-end and back-end need to allow credentials, i.e., cookies
        .post<AuthResponse>(this.LOGIN_URL, hubUser, {
          withCredentials: true,
        })
        .pipe(
          map((authResponse) => this.saveToken(authResponse)),
          tap(() => console.log(document.cookie)),
          catchError(this.handleError.bind(this, 'login'))
        )
    );
  }

  // Log out the user by calling the backend logout endpoint
  public logout(): Observable<void> {
    return this.http
      .post<void>(this.LOGOUT_URL, null, { withCredentials: true })
      .pipe(
        tap(() => this.logoutActions()),
        catchError(this.handleError.bind(this, 'logout'))
      );
  }

  // Handle errors for login and registration
  private handleError(
    type: string,
    error: HttpErrorResponse
  ): Observable<never> {
    let message: string = '';
    if (error.status >= 500) message = 'Server is offline';
    else if (type === 'login' && error.status === 401) {
      message = 'Your username or password may be incorrect';
    } else if (type === 'register' && error.status === 401) {
      message = 'This user already exists';
    } else if (type === 'logout' && error.status === 401) {
      message = 'Session expired before logout';
    } else {
      message =
        'Unkown error: ' +
        (error.error instanceof ErrorEvent
          ? message + error.error.message
          : message + error.message);
    }

    return throwError(() => new Error(message));
  }

  /* REFRESH TOKEN MANAGEMENT */

  // Flag to indicate if a token refresh is in progress
  /*
  It is a tactic to avoid that when the refresh token itself expires, 
  it generates an infinite 401 error loop coming from the request to update the jwt token, 
  which is intercepted by intercept, which in turn makes another request to update the jwt 
  (believing that only jwt is expired )
  */
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>('');

  // IMPORTANT: do the import in provider in app.module
  // Intercept HTTP requests to handle token expiration
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return request.url === this.REFRESH_TOKEN_URL
      ? next.handle(request)
      : next.handle(request).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.handle401Error(request, next);
            }
            return throwError(() => error);
          })
        );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Indica que a renovação está em andamento

      return this.refreshToken().pipe(
        switchMap((authResponse) => {
          this.isRefreshing = false;
          this.saveToken(authResponse);
          this.refreshTokenSubject.next(authResponse.accessToken); // Atualiza com o novo token
          return next.handle(this.addTokenHeader(request, authResponse.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(''); // Atualiza para indicar falha
          this.logoutActions();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null), // Agora também precisa lidar com a falha
        take(1),
        //**`take(1)`**: Este operador garante que apenas o primeiro valor que passa pelo `filter` (o primeiro token não nulo) seja usado e, em seguida, completa o fluxo. Isso significa que ele está esperando por uma única emissão válida do token e depois desinscreve do `BehaviorSubject`.
        switchMap((token) => {
          return token === ''
            ? EMPTY
            : next.handle(this.addTokenHeader(request, token));
        }),
        catchError((err) => {
          // Trata o caso em que nenhum token válido é recebido
          return throwError(
            () =>
              new Error(
                'Falha na autenticação, por favor faça login novamente.'
              )
          );
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  private refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.REFRESH_TOKEN_URL, null, {
      withCredentials: true,
    });
  }
}

/*
Why Login is POST?
1. Security: on the contrary GET, POST don't expose data in URL
2. Load: POST don't have limit about data size that can send
3. Semantics: POST send a resource to be process, like credencials
4. Idempotence: each login generates a new autentication
*/

/*
JWT, Refresh Token, Local Storage and Cookies

Introduction: JWT and Refresh Token: JWT Token is the free step proving you are accredited. However, it can be stolen
by some malicious agent and, because of this, it has a short lifespan. So that the user is not affected,
he also gets another pass to renew the JWT Token: Refresh Token. This one is harder to steal
if stored in a safe place and is longer lasting.

JWT on Local Storage:
1. Ease and simplicity for front end programmers to access the token
2. Persistence even when closing the browser

Refresh Token in Cookies
1. Security: HttpOnly (cannot be accessed via JS), reducing risks with XSS and Secure (only sent over secure HTTPS)
   NOTE: Cross-Site Scripting (XSS) is an attacker injecting malicious scripts into viewed web pages
   by other users

Why not store everything in local storage?
1. XSS Vulnerability

Why not save it all in cookies?
1. Cookies are limited in size (about 4KB)
2. Performance: Cookies are automatically sent in each HTTP request to the corresponding domain,
   which can overload and impact performance
3. Vulnerable to Cross-Site Request Forgery (CSRF): when the user is authenticated on site
   naively visits a malicious website Y. In Y, he is tricked into making requests to the API used by X.
   As all credentials are being sent automatically via Cookies, requests will
   operate normally. This is often resolved with security headers like `SameSite` in cookies.
   NOTE: CSRF is different from CORS, which is a mechanism that manages who can make requests to the API in addition to
   of the already pre-defined default domain.
*/
