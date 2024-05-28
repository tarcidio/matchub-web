import { Injectable } from '@angular/core';
import { CommentBase } from '../../../../classes/dto/comment/comment-base/comment-base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDetails } from '../../../../classes/dto/comment/comment-details/comment-details';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/';
  // URL for post comment: part 1
  private readonly POST_COMMENT_URL_01 = `${this.API_URL}screens/`;
  // URL for post comment: part 2
  private readonly POST_COMMENT_URL_02 = `/comments`;

  get headers(){
    return new HttpHeaders({
      'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
    });
  }

  constructor(private http: HttpClient) {}

  public addComment(screenId: number, comment: CommentBase): Observable<CommentDetails> {
    const POST_COMMENT_URL =
      this.POST_COMMENT_URL_01 + screenId + this.POST_COMMENT_URL_02;
    return this.http.post<CommentDetails>(POST_COMMENT_URL, comment, {
      headers: this.headers,
    });
  }
}
