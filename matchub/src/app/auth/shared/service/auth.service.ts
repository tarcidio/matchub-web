import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { SignUp } from '../../../classes/signUp/sign-up';
import { Token } from '../../../classes/token/token';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private prefixHttp: string = 'http://';
  private apiUrl: string = this.prefixHttp + 'localhost:8080/';

  private saveToken(token: Token): void {
    localStorage.setItem('accessToken', token.access_token);
    localStorage.setItem('refreshToken', token.refresh_token);
  }

  public registerUser(hubUser: SignUp): Observable<void> {
    return this.http.post<Token>(`${this.apiUrl}auth/register`, hubUser).pipe(
      map(token => {
        this.saveToken(token);
      }),
      catchError(error => {
        const message = `Registration failed: ${error.message || 'Unknown error'}`;
        return throwError(() => new Error(message));
      })
    );
  }

  

  loginUser(username: string, password: string){
    //console.log(username + password);
    return;
  }
}


/*
testeTESTE123*
*/