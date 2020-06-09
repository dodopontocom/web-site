import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";
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
        BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,

                title: post.title,
                price: post.price,
                city: post.city,
                address: post.address,
                metragem: post.metragem,
                rooms: post.rooms,
                baths: post.baths,
                permuta: post.permuta,
                type: post.type,
                owner: post.owner,
                contact: post.contact,
                description: post.description,
                refNumber: post.refNumber,
                
                imagePath: post.imagePath,
                creator: post.creator
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
    return this.http.get<{
      _id: string;
      
      title: string;
      price: string;
      city: string;
      address: string;
      metragem: string;
      rooms: string;
      baths: string;
      permuta: string;
      type: string;
      owner: string;
      contact: string;
      description: string;
      refNumber: string;

      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id
    );
  }

  addPost(title: string,
          price: string,
          city: string,
          address: string,
          metragem: string,
          rooms: string,
          baths: string,
          permuta: string,
          type: string,
          owner: string,
          contact: string,
          description: string,
          refNumber: string,
          image: File) {

    const postData = new FormData();
    
    postData.append("title", title);
    postData.append("price", price);
    postData.append("city", city);
    postData.append("address", address);
    postData.append("metragem", metragem);
    postData.append("rooms", rooms);
    postData.append("baths", baths);
    postData.append("permuta", permuta);
    postData.append("type", type);
    postData.append("owner", owner);
    postData.append("contact", contact);
    postData.append("description", description);
    postData.append("refNumber", refNumber);

    postData.append("image", image, title);
    this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }


  updatePost(id: string,
            title: string,
            price: string,
            city: string,
            address: string,
            metragem: string,
            rooms: string,
            baths: string,
            permuta: string,
            type: string,
            owner: string,
            contact: string,
            description: string,
            refNumber: string,
            image: File | string) {

    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      
      postData.append("title", title);
      postData.append("price", price);
      postData.append("city", city);
      postData.append("address", address);
      postData.append("metragem", metragem);
      postData.append("rooms", rooms);
      postData.append("baths", baths);
      postData.append("permuta", permuta);
      postData.append("type", type);
      postData.append("owner", owner);
      postData.append("contact", contact);
      postData.append("description", description);
      postData.append("refNumber", refNumber);

      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        
        title: title,
        price: price,
        city: city,
        address: address,
        metragem: metragem,
        rooms: rooms,
        baths: baths,
        permuta: permuta,
        type: type,
        owner: owner,
        contact: contact,
        description: description,
        refNumber: refNumber,

        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }
}
