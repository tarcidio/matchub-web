import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ChampionDetails } from '../../../../classes/champion/champion-details/champion-details';
import { Store } from '../../../../classes/store/store';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for get champions
  private readonly GET_CHAMPIONS_URL = `${this.API_URL}champions`;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
  });

  constructor(private http: HttpClient, private store: Store) {
    this.initChampions(); // Loads initial champion data when the service is instantiated
  }

  // Loads initial champion data when the service is instantiated.
  private initChampions(): void {
    this.http
      .get<ChampionDetails[]>(this.GET_CHAMPIONS_URL, {
        headers: this.headers,
      })
      .subscribe({
        next: (champions) => this.store.set('champions', champions),
      });
    // Subscribes to the observable to trigger the HTTP request and set store
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
    name: string | null | undefined, // Name of the champion to be searched for
    type: string // Type of default image to return if the champion is not found
  ): Observable<string> {
    return this.getAllChampions().pipe(
      // Travels through the store's champions vector
      map((champions) => {
        if (champions === undefined || name === undefined) 
          return this.getPathDefault(type);
        else if (champions.some((champion) => champion.name === name))
          return `../../../../assets/champions/${name}_0.jpg`;
        else {
          return this.getPathDefault(type);
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
