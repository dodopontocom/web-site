import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Message } from "./message.model";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + "/messages/";

@Injectable({ providedIn: "root" })
export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<{messages: Message[]; postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  addMessage(
          name: string,
          phone: string,
          content: string) {

    const postData = new FormData();
    
    postData.append("name", name);
    postData.append("phone", phone);
    postData.append("content", content);

    console.log("--------> " + name);
    
    console.log("--------> " + BACKEND_URL);
    console.log("--------> " + this.router);

    this.http
      .post<{ message: string, post: Message[] }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  
}
