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

    const postDataMessage = new FormData();
    
    postDataMessage.append("name", name);
    postDataMessage.append("phone", phone);
    postDataMessage.append("content", content);

    console.log("--------> " + name);
    console.log("--------> " + phone);
    console.log("--------> " + content);
    
    this.http.post<{ message: string, post: Message }>(
        BACKEND_URL,
        postDataMessage
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  
}
