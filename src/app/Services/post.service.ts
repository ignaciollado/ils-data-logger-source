import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostDTO } from '../Models/post.dto';
import { SharedService } from './shared.service';

const URL_API = '../../assets/phpAPI/'
const URL_API_SRV = "https://jwt.idi.es/public/index.php"
const URL_MOCKS = '../../assets/mocks/consumptions.json'

export interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'posts';
  }

  getPosts(): Observable<PostDTO[]> {
    return this.http
      .get<PostDTO[]>(`${URL_API}`)
      .pipe(catchError(this.sharedService.handleError));
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    return this.http
      .get<PostDTO[]>('http://localhost:3000/users/posts/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http
      .post<PostDTO>(`${URL_API}delegationCreate.php`, post)
      .pipe(catchError(this.sharedService.handleError));
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http
      .get<PostDTO>(`${URL_API}` + '/' + postId)
      .pipe(catchError(this.sharedService.handleError));
  }

  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    return this.http
      .put<PostDTO>(`${URL_API}` + '/' + postId, post)
      .pipe(catchError(this.sharedService.handleError));
  }

  likePost(postId: string): Observable<updateResponse> {
    return this.http
      .put<updateResponse>(`${URL_API}` + '/like/' + postId, NONE_TYPE)
      .pipe(catchError(this.sharedService.handleError));
  }

  dislikePost(postId: string): Observable<updateResponse> {
    return this.http
      .put<updateResponse>(`${URL_API}` + '/dislike/' + postId, NONE_TYPE)
      .pipe(catchError(this.sharedService.handleError));
  }

  deletePost(postId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(`${URL_API}` + '/' + postId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
