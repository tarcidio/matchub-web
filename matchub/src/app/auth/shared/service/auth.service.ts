import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { SignUp } from '../../../classes/auth/signUp/sign-up';
import { AuthResponse } from '../../../classes/auth/auth-response/auth-response';
import { Login } from '../../../classes/auth/login/login';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '../../../classes/store/store';

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

  constructor(private http: HttpClient, private store: Store) {}

  /* LOGIN, LOGOUT AND TOKEN MANAGEMENT */

  // Check if the user is logged in by verifying the presence of an access token in local storage
  public isLoggin(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Log out the user by removing the access token from local storage and reloading the page
  public logout(): void {
    localStorage.clear();
    window.location.reload();
  }

  // Save the access token and nickname to local storage and store
  private saveToken(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
  }

  /* LOGIN AND SIGNUP MANAGEMENT */

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
          catchError(this.handleError.bind(this, 'login'))
        )
    );
  }

  // Handle errors for login and registration
  private handleError(type: string, error: HttpErrorResponse) {
    let message =
      type === 'login'
        ? 'Login failed: Unknown error'
        : 'Registration failed: Unknown error';
    if (error.status === 403) {
      // Custom message for 403 Forbidden
      message =
        type === 'login'
          ? 'Your username or password may be incorrect'
          : 'This user already exists';
    } else {
      message = type === 'login' ? 'Login failed: ' : 'Registration failed: ';
      message =
        error.error instanceof ErrorEvent
          ? message + error.error.message
          : message + error.message;
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
  isRefreshing: boolean = false;

  // IMPORTANT: do the import in provider in app.module
  // Intercept HTTP requests to handle token expiration
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // 401 error code means token is either invalid or expired
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  // Handle 401 errors by refreshing the token
  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // If this is the first time you are doing the refresh, try doing the refresh
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return this.http
        .get<AuthResponse>(this.REFRESH_TOKEN_URL, {
          withCredentials: true,
        })
        .pipe(
          switchMap((authResponse) => {
            this.isRefreshing = false;
            // If you managed to renew, then update with the new token
            this.saveToken(authResponse);

            // Clone the old request and replace the original headers with
            // updated headers containing the new token
            const clonedRequest = request.clone({
              headers: request.headers.set(
                'Authorization',
                'Bearer ' + authResponse.accessToken
              ),
            });

            // Continue with the new request
            return next.handle(clonedRequest);
          })
        );
    } else {
      // If not, it means that the refresh token has expired and it is time to log out
      this.isRefreshing = false;
      //this.logout();
      return EMPTY; // Requires that it returns an observable, so let's return one, but one that does nothing
    }
  }

  public refreshToken(): Observable<void> {
    return this.http
      .get<AuthResponse>(this.REFRESH_TOKEN_URL, {
        withCredentials: true,
      })
      .pipe(map((authResponse) => this.saveToken(authResponse)));
    // You don't need to catch the error due to the intercept
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
