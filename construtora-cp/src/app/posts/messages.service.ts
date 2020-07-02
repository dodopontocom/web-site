import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Message } from "./message.model";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + "/messages/";

@Injectable({ providedIn: "root" })
export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<{messages: Message[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getMessages() {
    this.http
      .get<{ message: string; messages: any }>(
        BACKEND_URL)
      .pipe(
        map(messageData => {
          return {
            messages: messageData.messages.map(message => {
              return {
                id: message._id,
                nome: message.nome,
                phone: message.phone,
                content: message.content,
                ref: message.ref
              };
            }),

          };
        })
      )
      .subscribe(transformedMessageData => {
        this.messages = transformedMessageData.messages;
        this.messagesUpdated.next({
          messages: [...this.messages]
        });
      });
  }
  
  addMessage(
          nome: string,
          phone: string,
          content: string,
          ref: string) {
            
    this.http.post<{ message: string, post: Message }>(
        BACKEND_URL,
        {
          nome,
          phone,
          content,
          ref
        }
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  
}
