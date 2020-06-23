import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";
const GCP_BUCKET_URL = environment.GCLOUD_APP_BUCKET;

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
                diferencialOpt: post.diferencialOpt,
                description: post.description,
                price: post.price,
                condPrice: post.condPrice,
                iptuPrice: post.iptuPrice,
                type: post.type,
                city: post.city,
                address: post.address,
                emCondominio: post.emCondominio,
                addressRef: post.addressRef,
                metragemTerreno: post.metragemTerreno,
                metragemConstrucao: post.metragemConstrucao,
                vagas: post.vagas,
                rooms: post.rooms,
                baths: post.baths,
                permuta: post.permuta,
                financiamento: post.financiamento,

                contactTelOne: post.contactTelOne,
                contactNameOne: post.contactNameOne,
                contactTelTwo: post.contactTelTwo,
                contactNameTwo: post.contactNameTwo,
                
                owner: post.owner,
                telOwner: post.telOwner,
                emailOwner: post.emailOwner,
                
                refNumber: post.refNumber,
                imagePath: GCP_BUCKET_URL + post.imagePath,
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
      diferencialOpt: string;
      description: string;
      price: string;
      condPrice: string;
      iptuPrice: string;
      type: string;
      city: string;
      address: string;
      emCondominio: string;
      addressRef: string;
      metragemTerreno: string;
      metragemConstrucao: string;
      vagas: string;
      rooms: string;
      baths: string;
      permuta: string;
      financiamento: string;

      contactTelOne: string;
      contactNameOne: string;
      contactTelTwo: string;
      contactNameTwo: string;
      
      owner: string;
      telOwner: string;
      emailOwner: string;
      
      refNumber: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id
    );
  }

  addPost(
          title: string,
          diferencialOpt: string,
          description: string,
          price: string,
          condPrice: string,
          iptuPrice: string,
          type: string,
          city: string,
          address: string,
          emCondominio: string,
          addressRef: string,
          metragemTerreno: string,
          metragemConstrucao: string,
          vagas: string,
          rooms: string,
          baths: string,
          permuta: string,
          financiamento: string,
        
          contactTelOne: string,
          contactNameOne: string,
          contactTelTwo: string,
          contactNameTwo: string,
          
          owner: string,
          telOwner: string,
          emailOwner: string,

          refNumber: string,
          image: File) {

    const postData = new FormData();
    
    postData.append("title", title);
    postData.append("diferencialOpt", diferencialOpt);
    postData.append("description", description);
    postData.append("price", price);
    postData.append("condPrice", condPrice);
    postData.append("iptuPrice", iptuPrice);
    postData.append("type", type);
    postData.append("city", city);
    postData.append("address", address);
    postData.append("emCondominio", emCondominio);
    postData.append("addressRef", addressRef);
    postData.append("metragemTerreno", metragemTerreno);
    postData.append("metragemConstrucao", metragemConstrucao);
    postData.append("vagas", vagas);
    postData.append("rooms", rooms);
    postData.append("baths", baths);
    postData.append("permuta", permuta);
    postData.append("financiamento", financiamento);

    postData.append("contactTelOne", contactTelOne);
    postData.append("contactNameOne", contactNameOne);
    postData.append("contactTelTwo", contactTelTwo);
    postData.append("contactNameTwo", contactNameTwo);
    
    postData.append("owner", owner);
    postData.append("telOwner", telOwner);
    postData.append("emailOwner", emailOwner);

    postData.append("refNumber", refNumber);
    postData.append("image", image, title
                                        .toLowerCase()
                                        .split(" ")
                                        .join("-"));
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
            diferencialOpt: string,
            description: string,
            price: string,
            condPrice: string,
            iptuPrice: string,
            type: string,
            city: string,
            address: string,
            emCondominio: string,
            addressRef: string,
            metragemTerreno: string,
            metragemConstrucao: string,
            vagas: string,
            rooms: string,
            baths: string,
            permuta: string,
            financiamento: string,
          
            contactTelOne: string,
            contactNameOne: string,
            contactTelTwo: string,
            contactNameTwo: string,
            
            owner: string,
            telOwner: string,
            emailOwner: string,        
    
            refNumber: string,
            image: File | string) {

    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      
      postData.append("title", title);
      postData.append("diferencialOpt", diferencialOpt);
      postData.append("description", description);
      postData.append("price", price);
      postData.append("condPrice", condPrice);
      postData.append("iptuPrice", iptuPrice);
      postData.append("type", type);
      postData.append("city", city);
      postData.append("address", address);
      postData.append("emCondominio", emCondominio);
      postData.append("addressRef", addressRef);
      postData.append("metragemTerreno", metragemTerreno);
      postData.append("metragemConstrucao", metragemConstrucao);
      postData.append("vagas", vagas);
      postData.append("rooms", rooms);
      postData.append("baths", baths);
      postData.append("permuta", permuta);
      postData.append("financiamento", financiamento);

      postData.append("contactTelOne", contactTelOne);
      postData.append("contactNameOne", contactNameOne);
      postData.append("contactTelTwo", contactTelTwo);
      postData.append("contactNameTwo", contactNameTwo);
      
      postData.append("owner", owner);
      postData.append("telOwner", telOwner);
      postData.append("emailOwner", emailOwner);
      
      postData.append("refNumber", refNumber);
      postData.append("image", image, title
                                          .toLowerCase()
                                          .split(" ")
                                          .join("-"));
    } else {
      postData = {
        id: id,
        
        title: title,
        diferencialOpt: diferencialOpt,
        description: description,
        price: price,
        condPrice: condPrice,
        iptuPrice: iptuPrice,
        type: type,
        city: city,
        address: address,
        emCondominio: emCondominio,
        addressRef: addressRef,
        metragemTerreno: metragemTerreno,
        metragemConstrucao: metragemConstrucao,
        vagas: vagas,
        rooms: rooms,
        baths: baths,
        permuta: permuta,
        financiamento: financiamento,
            
        // Contatos
        contactTelOne: contactTelOne,
        contactNameOne: contactNameOne,
        contactTelTwo: contactTelTwo,
        contactNameTwo: contactNameTwo,
        
        owner: owner,
        telOwner: telOwner,
        emailOwner: emailOwner,

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
