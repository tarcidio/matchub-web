import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SignUp } from '../../../classes/auth/signUp/sign-up';
import { Token } from '../../../classes/auth/token/token';
import { Login } from '../../../classes/auth/login/login';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private prefixHttp: string = 'http://';
  private apiUrl: string = this.prefixHttp + 'localhost:8080/';

  private saveToken(token: Token): void {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
  }

  public registerUser(hubUser: SignUp): Observable<void> {
    return this.http.post<Token>(`${this.apiUrl}auth/register`, hubUser).pipe(
      map((token) => this.saveToken(token)),
      catchError(this.handleError.bind(this, 'register'))
    );
  }

  public loginUser(hubUser: Login): Observable<void> {
    return this.http
      .post<Token>(`${this.apiUrl}auth/authenticate`, hubUser)
      .pipe(
        map((token) => this.saveToken(token)),
        catchError(this.handleError.bind(this, 'login'))
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
