import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ChampionDetails } from '../../../../classes/champion/champion-details/champion-details';
import { Store } from '../../../../classes/store/store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  private prefixHttp: string = 'http://'; // Prefix for the HTTP protocol
  private apiUrl: string = this.prefixHttp + 'localhost:8080/'; // Base URL for the API

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
  });

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router
  ) {
    this.loadInitialChampions(); // Loads initial champion data when the service is instantiated
  }

  // Loads initial champion data when the service is instantiated.
  private loadInitialChampions(): void {
    this.http
      .get<ChampionDetails[]>(`${this.apiUrl}champions`, { headers: this.headers })
      .pipe(
        tap((champions) => this.store.set('champions', champions)), // Stores the fetched champions in the local store
      )
      .subscribe(); // Subscribes to the observable to trigger the HTTP request
  }

  // Selects and returns the champions from the store
  public getAllChampions(): Observable<ChampionDetails[]> {
    return this.store.select('champions');
  }

  // Returns an observable for the image path that may vary if the store is not properly loaded
  /*
  Currently, the images are in the frontend. This is not efficient. The idea is to migrate the images to a 
  cloud service so that users only upload the necessary images. Based on this idea, the function 
  returning an Observable is very good, because, to refactor, we will only need to change this function 
  and make an http call with the link created from the champion's name.
  */
  public getPathImg(
    name: string | null, // Name of the champion to be searched for
    type: string // Type of default image to return if the champion is not found
  ): Observable<string> {
    return this.getAllChampions().pipe(
      // Travels through the store's champions vector
      map((champions) => {
        // return champions === undefined // If the array is undefined, it's low connection
        //   ? this.getPathDefault(type) // Return default image while the champions isn't loaded
        //   : champions.some((champion) => champion.name === name) // Check if the name is valid
        //   ? `../../../../assets/champions/${name}_0.jpg` // If yes, give the image
        //   : throwError(() => new Error('Champions not found')) ; // If not, throw a errow
        if(champions === undefined)
          return this.getPathDefault(type);
        else if (champions.some((champion) => champion.name === name))
          return `../../../../assets/champions/${name}_0.jpg`;
        else{
          throw new Error('Champion not found')
        }
      })
    );
  }

  // Returns the path to a default image based on the type.
  private getPathDefault(type: string) {
    return '../../../../../assets/default' + type + '.jpg';
  }
}

// No home tem que ter o carrossel para cima
