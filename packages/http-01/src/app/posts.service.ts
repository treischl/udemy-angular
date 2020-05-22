import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from "@angular/common/http";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { Post } from "./post.model";

const postsUrl = "https://udemy-angular-b625a.firebaseio.com/posts.json";

@Injectable({ providedIn: "root" })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePosts(title: string, content: string) {
    return this.http
      .post<{ name: string }>(
        postsUrl,
        { title, content },
        {
          observe: "response",
        },
      )
      .pipe(
        catchError((errorResponse) => {
          this.error.next(errorResponse.message);
          return throwError(errorResponse);
        }),
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(postsUrl, {
        headers: new HttpHeaders({
          "Custom-Header": "Hello",
        }),
        params: new HttpParams().set("print", "pretty").set("custom", "key"),
        responseType: "json",
      })
      .pipe(
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
    return this.http
      .delete(postsUrl, {
        observe: "events",
        responseType: "text",
      })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
            // ...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event);
          }
        }),
      );
  }
}
