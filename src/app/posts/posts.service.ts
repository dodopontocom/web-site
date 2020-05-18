import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

//const BACKEND_URL = environment.apiUrl + "/posts/";
//const BACKEND_URL = process.env.BACKEND_URL;
//const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[]; postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/v1/posts" + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                name: post.name,
                phone: post.phone,
                content: post.content,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; name: string; phone: string; content: string, imagePath: string }>(
      "http://localhost:3000/api/v1/posts/" + id
    );
  }

  addPost(name: string, phone: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("name", name);
    postData.append("phone", phone);
    postData.append("content", content);
    postData.append("image", image, name);
    this.http
      .post<{ message: string, post: Post }>(
        "http://localhost:3000/api/v1/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }


  updatePost(id: string, name: string, phone: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("name", name);
      postData.append("phone", phone);
      postData.append("content", content);
      postData.append("image", image, name);
    } else {
      postData = {
        id: id,
        name: name,
        phone: phone,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/v1/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/v1/posts/" + postId);
  }
}
