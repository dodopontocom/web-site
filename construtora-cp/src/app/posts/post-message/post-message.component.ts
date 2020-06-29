import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MessagesService } from "../messages.service";
import { Message } from "../message.model";
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-message',
    templateUrl: './post-message.component.html',
    styleUrls: ['./post-message.component.css']
})
export class PostMessageComponent implements OnInit, OnDestroy {

  enteredName = "";
  enteredPhone = "";
  enteredContent = "";

  message: Message;
  isLoading = false;
  messageForm: FormGroup;

  private mode = "mensagem";
  private authStatusSub: Subscription;

  textareaPlaceHolder: string = "Olá! Eu gostei deste anúncio. Pode me contatar pelo telefone fornecido à cima.";

  constructor(
    public messagesService: MessagesService,
    public route: ActivatedRoute,
    private autService: AuthService,
    public dialogRef: MatDialogRef<PostMessageComponent>
  ) {}

  ngOnInit() {

    console.log("Mode: " + this.mode);
    console.log("Form: " + this.messageForm);

    this.authStatusSub = this.autService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.messageForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      phone: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      content: new FormControl(this.textareaPlaceHolder, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.mode = "mensagem";
    });
  }

  onSaveMessage() {
    console.log(this.messageForm.value);
    this.isLoading = true;
    if (this.messageForm.invalid) {
      return;
    }
    this.messagesService.addMessage(
      this.messageForm.value.name,
      this.messageForm.value.phone,
      this.messageForm.value.content
    );
    this.isLoading = false;
    this.messageForm.reset();

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
   }

}