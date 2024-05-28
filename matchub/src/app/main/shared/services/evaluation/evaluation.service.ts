import { Injectable } from '@angular/core';
import { EvaluationBase } from '../../../../classes/dto/evaluation/evaluation-base/evaluation-base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EvaluationLinks } from '../../../../classes/dto/evaluation/evaluation-links/evaluation-links';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  // Base API URL
  private readonly API_URL = 'http://localhost:8080/comments/';
  // URL for get champions
  private readonly EVALUATION_URL = `/evaluations`;

  get headers(){
    return new HttpHeaders({
      'Content-Type': 'application/json', // Sets content type as JSON for all HTTP requests.
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Retrieves the access token from local storage for authorization.
    });
  }

  constructor(private http: HttpClient) {}

  public createEvaluation(
    commentId: number,
    evaluation: EvaluationBase
  ): Observable<EvaluationLinks> {
    const CREATE_EVALUATION_URL =
      this.API_URL + commentId + this.EVALUATION_URL;
    return this.http.post<EvaluationLinks>(CREATE_EVALUATION_URL, evaluation, {
      headers: this.headers,
    });
  }

  public updateEvaluation(
    commentId: number,
    evaluationId: number,
    evaluation: EvaluationBase
  ): Observable<EvaluationLinks> {
    const UPDATE_EVALUATION_URL =
      this.API_URL + commentId + this.EVALUATION_URL + '/' + evaluationId;
    return this.http.put<EvaluationLinks>(UPDATE_EVALUATION_URL, evaluation, {
      headers: this.headers,
    });
  }

  public deleteEvaluation(commentId: number, evaluationId: number): Observable<void>{
    const DELETE_EVALUATION_URL =
      this.API_URL + commentId + this.EVALUATION_URL + '/' + evaluationId;
    return this.http.delete<void>(DELETE_EVALUATION_URL, {
      headers: this.headers,
    });
  }
}
