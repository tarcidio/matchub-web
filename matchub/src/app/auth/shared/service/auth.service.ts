import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { SignUp } from '../../../classes/auth/signUp/sign-up';
import { AuthResponse } from '../../../classes/auth/auth-response/auth-response';
import { Login } from '../../../classes/auth/login/login';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '../../../classes/store/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements HttpInterceptor {
  constructor(private http: HttpClient, private store: Store) {}

  private prefixHttp: string = 'http://';
  private apiUrl: string = this.prefixHttp + 'localhost:8080/';

  isRefreshing: boolean = false;

  isLoggin(): boolean {
    return !!localStorage.length;
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    window.location.reload();
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.http
        .get<AuthResponse>(`${this.apiUrl}auth/refresh-token`, {
          withCredentials: true,
        })
        .pipe(
          switchMap((authResponse) => {
            this.isRefreshing = false;
            this.saveTokenAndNickname(authResponse);

            // Clone the request and replace the original headers with
            // updated headers containing the new token
            const clonedRequest = request.clone({
              headers: request.headers.set(
                'Authorization',
                'Bearer ' + authResponse.accessToken
              ),
            });

            // Continue with the new request
            return next.handle(clonedRequest);
          }),
          // catchError((err) => {
          //   this.isRefreshing = false;
          //   this.logout(); // or handle error appropriately
          //   console.log('aqui estou' + localStorage.getItem('accessToken'));
          //   return throwError(() => err);
          // })
        );
    }else{
      // 
      this.isRefreshing = false;
      this.logout(); // or handle error appropriately
      return EMPTY;
    }
  }

  // IMPORTANT: do the import in provider in app.module
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

  private saveTokenAndNickname(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    this.store.set('nickname', authResponse.nickname);
  }

  public registerUser(hubUser: SignUp): Observable<void> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}auth/register`, hubUser, {
        withCredentials: true,
      })
      .pipe(
        map((authResponse) => this.saveTokenAndNickname(authResponse)),
        catchError(this.handleError.bind(this, 'register'))
      );
  }

  public loginUser(hubUser: Login): Observable<void> {
    return (
      this.http
        // É necessário que tanto o front quanto o back permita credenciais, isto é, cookies
        .post<AuthResponse>(`${this.apiUrl}auth/authenticate`, hubUser, {
          withCredentials: true,
        })
        .pipe(
          map((authResponse) => this.saveTokenAndNickname(authResponse)),
          catchError(this.handleError.bind(this, 'login'))
        )
    );
  }

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
}

/*
Why Login is POST?
1. Security: on the contrary GET, POST don't expose data in URL
2. Load: POST don't have limit about data size that can send
3. Semantics: POST send a resource to be process, like credencials
4. Idempotence: each login generates a new autentication
*/
