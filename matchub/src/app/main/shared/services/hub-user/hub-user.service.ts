import { Injectable } from '@angular/core';
import {
  Observable,
  Subscription,
  combineLatest,
  iif,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Store } from '../../../../classes/store/store';
import { HubUserDetails } from '../../../../classes/dto/hub-user/hub-user-details/hub-user-details';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubUserBase } from '../../../../classes/dto/hub-user/hub-user-base/hub-user-base';
import { HubUserLinks } from '../../../../classes/dto/hub-user/hub-user-links/hub-user-links';
import { ChangePassword } from '../../../../classes/auth/change-password/change-password';
import { HubUserImage } from '../../../../classes/dto/hub-user/hub-user-image/hub-user-image';
import { ResetPassword } from '../../../../classes/auth/reset-password/reset-password';
import { AuthService } from '../../../../auth/shared/service/auth.service';
import { AuthResponse } from '../../../../classes/auth/auth-response/auth-response';

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
  private readonly UPLOAD_IMAGE_LOGGED_URL = `${this.API_URL}hubusers`;
  // URL for reset password
  private readonly RESET_PASSWORD_URL = `${this.API_URL}hubusers/reset-password`;
  // URL for confirm email
  private readonly CONFIRM_EMAIL_URL = `${this.API_URL}hubusers/confirm`;

  get headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
    });
  }

  constructor(private http: HttpClient, private store: Store, private authService: AuthService) {}

  // getLoggedHubUser(): Observable<HubUserDetails> {
  //   return this.http
  //     .get<HubUserDetails>(this.GET_LOGGED_URL, { headers: this.headers })
  //     .pipe(tap((hubUser) => this.store.set('hubUser', hubUser)));
  // }

  getLoggedHubUser(): Observable<HubUserDetails> {
    return this.getHubUser().pipe(
      switchMap((hubUser) =>
        iif(
          () => !hubUser,
          this.http
            .get<HubUserDetails>(this.GET_LOGGED_URL, { headers: this.headers })
            .pipe(tap((newHubUser) => this.store.set('hubUser', newHubUser))),
          of(hubUser)
        )
      )
    );
  }

  /* UPLOAD IMAGE */

  public upload(file: File): Observable<HubUserImage> {
    const formData = new FormData();
    formData.append('file', file);

    const headerImage = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
    });

    return this.http.post<HubUserImage>(
      this.UPLOAD_IMAGE_LOGGED_URL,
      formData,
      {
        headers: headerImage,
      }
    );
  }

  // Public method to get the user's image URL
  public getImgLoggedHubUser(): Observable<string> {
    return this.getEmailHubUser().pipe(
      map((email) => this.getImgHubUser(email))
    );
  }

  public getImgHubUser(email: string): string {
    return `https://hub-user-images.s3.sa-east-1.amazonaws.com/${email.replace(
      /@/g,
      '_'
    )}.jpg`;
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

  // Reset password
  public resetPassword(reset: ResetPassword, token: string): Observable<void> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
      Authorization: `Bearer ${token}`, // Retrieves the access token from parameter
    });
    return this.http.patch<void>(this.RESET_PASSWORD_URL, reset, {
      headers: header,
    });
  }

  public confirmEmail(token: string): Observable<void> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
      Authorization: `Bearer ${token}`, // Retrieves the access token from parameter
    });
    return this.http
      .patch<void>(this.CONFIRM_EMAIL_URL, null, {
        headers: header,
      })
      .pipe(tap(() => this.authService.saveToken(new AuthResponse(token))));
  }
}
