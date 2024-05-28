import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ScreenDetails } from '../../../../classes/dto/screen/screen-details/screen-details';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private http: HttpClient) {}

  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for refreshing tokens
  private readonly SCREEN_URL = `${this.API_URL}screens/`;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
  });

  private handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.status === 403) {
      // Acess denied
      console.error('Acess denied.', error.error);
    } else {
      // Others
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(message));
  }

  public getScreen(spotligthId : number, opponentId : number): Observable<ScreenDetails>{
    const GET_SCREEN_URL : string = this.SCREEN_URL + spotligthId + '/' + opponentId;
    return this.http.get<ScreenDetails>(GET_SCREEN_URL, { headers: this.headers });
  }


}
