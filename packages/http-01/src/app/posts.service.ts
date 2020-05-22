import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { Post } from "./post.model";

const postsUrl = "https://udemy-angular-b625a.firebaseio.com/posts.json";

@Injectable({ providedIn: "root" })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePosts(title: string, content: string) {
    return this.http
      .post<{ name: string }>(postsUrl, { title, content })
      .pipe(
        catchError((errorResponse) => {
          this.error.next(errorResponse.message);
          return throwError(errorResponse);
        }),
      );
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>(postsUrl).pipe(
      map((responseData) =>
        Object.keys(responseData || {}).map((key) => ({
          ...responseData[key],
          id: key,
        })),
      ),
      catchError((errorResponse) => {
        // Send to analytics server, then...
        this.error.next(errorResponse.message);
        return throwError(errorResponse);
      }),
    );
  }

  clearPosts() {
    return this.http.delete(postsUrl);
  }
}
