import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { Store } from '../../../../classes/store/store';
import { HubUserDetails } from '../../../../classes/hub-user/hub-user-details/hub-user-details';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubUserBase } from '../../../../classes/hub-user/hub-user-base/hub-user-base';
import { HubUserLinks } from '../../../../classes/hub-user/hub-user-links/hub-user-links';
import { ChangePassword } from '../../../../classes/auth/change-password/change-password';

@Injectable({
  providedIn: 'root',
})
export class HubUserService {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for get logged hub user informations
  private readonly GET_LOGGED_URL = `${this.API_URL}hubusers`;
  private readonly UPDATE_LOGGED_URL = `${this.API_URL}hubusers`;
  private readonly CHANGE_PASSWORD_LOGGED_URL = `${this.API_URL}hubusers`;

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
      .get<HubUserDetails>(this.GET_LOGGED_URL, {
        headers: this.headers,
      })
      .subscribe({ next: (hubUser) => this.store.set('hubUser', hubUser) }); // Subscribes to the observable to trigger the HTTP request
  }

  /* GET ATTRIBUTES FROM LOGGED HUB USER */

  public getHubUser() {
    return this.store.select<HubUserDetails>('hubUser');
  }

  // Public method to get the user's nickname
  public getNickNameHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.nickname) || 'Username'));
  }

  // Public method to get the user's firstname
  public getFirstNameHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.firstname) || 'Firstname'));
  }

  // Public method to get the user's firstname
  public getLastNameHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.lastname) || 'Lastname'));
  }

  // Public method to get the user's firstname
  public getEmailHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.email) || 'Email'));
  }

  // Public method to get the user's firstname
  public getUserNameHubUser(): Observable<string> {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.username) || 'Username'));
  }

  // Public method to get the user's image URL
  public getImgHubUser(): Observable<string> {
    return of('../../../../../assets/defaultHubUser.jpg');
  }

  public getHubUserId() {
    return this.store
      .select<HubUserDetails>('hubUser')
      .pipe(map((hubUser) => (hubUser && hubUser.id) || undefined));
  }

  /* MANAGE INTERACTIONS WITH API BACK END */

  public updateHubUser(hubUser: HubUserBase): Observable<HubUserLinks> {
    return this.http
      .put<HubUserLinks>(this.UPDATE_LOGGED_URL, hubUser, {
        headers: this.headers,
      })
      .pipe(
        switchMap((updateHubUserLinks) =>
          this.getHubUser().pipe(
            take(1), // Avoid recursion
            tap((curHubUserDetails) => {
              curHubUserDetails.nickname = updateHubUserLinks.nickname;
              curHubUserDetails.firstname = updateHubUserLinks.firstname;
              curHubUserDetails.lastname = updateHubUserLinks.lastname;
              curHubUserDetails.email = updateHubUserLinks.email;
              this.store.set('hubUser', curHubUserDetails);
            }),
            map(() => updateHubUserLinks)
          )
        )
      );
  }

  public changePassword(changePassword: ChangePassword): Observable<void> {
    return this.http.patch<void>(
      this.CHANGE_PASSWORD_LOGGED_URL,
      changePassword,
      {
        headers: this.headers,
      }
    );
  }
}
