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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        "http://localhost:3000/api/v1/posts"
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            name: post.name,
            phone: post.phone,
            content: post.content,
            imagePath: post.imagePath
          };
        });
      }))

      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
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
        const post: Post = {
          id: responseData.post.id,
          name: name,
          phone: phone,
          content: content,
          imagePath: responseData.post.imagePath
      };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          name: name,
          phone: phone,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/v1/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });

  }
}
