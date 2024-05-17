import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Store } from '../../../../classes/store/store';
import { HubUserDetails } from '../../../../classes/hub-user/hub-user-details/hub-user-details';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HubUserService {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for get logged hub user informations
  private readonly GET_LOGGED_URL = `${this.API_URL}hubusers`;

  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
  });

  constructor(private http: HttpClient, private store: Store) {
    this.initUser(); // Initialize user data on service instantiation
  }

  // Method to initialize user data
  private initUser(): void {
    this.http
      .get<HubUserDetails[]>(this.GET_LOGGED_URL, {
        headers: this.headers,
      })
      .subscribe({ next: (hubUser) => this.store.set('hubUser', hubUser) }); // Subscribes to the observable to trigger the HTTP request
  }

  // Public method to get the user's nickname
  public getNicknameHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.nickname) || 'Username'));
  }

  // Public method to get the user's image URL
  public getImgHubUser(): Observable<string> {
    return of('../../../../../assets/defaultHubUser.jpg');
  }

  public getHubUserId(){
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.id) || undefined));
  }
}
