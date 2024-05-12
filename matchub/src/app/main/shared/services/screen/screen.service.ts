import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ChampionDetails } from '../../../../classes/champion/champion-details/champion-details';
import { ScreenDetails } from '../../../../classes/screen/screen-details/screen-details';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private http: HttpClient) {}

  private prefixHttp: string = 'http://';
  private apiUrl: string = this.prefixHttp + 'localhost:8080/';

  private getHeader(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  }

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

  // public getAllChampions(): Observable<ChampionDetails[]> {
  //   return this.http.get<ChampionDetails[]>(`${this.apiUrl}champions`, { headers: this.getHeader() })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // } 

  public getScreen(screenId : number){
    return this.http.get<ScreenDetails>(`${this.apiUrl}screens/${screenId}`, { headers: this.getHeader() })
      .pipe(
        catchError(this.handleError)
      );
  }


}
