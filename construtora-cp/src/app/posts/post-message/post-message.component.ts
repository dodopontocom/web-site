import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  nome = "";
  phone = "";
  content = "";

  // message: Message[] = [];
  message: Message;
  // posts: Post[] = [];
  isLoading = false;
  messageForm: FormGroup;

  private mode = "mensagem";
  private authStatusSub: Subscription;

  textareaPlaceHolder: string = "Olá! Eu gostei deste anúncio. Pode me contatar pelo telefone fornecido à cima.";

  constructor(
    public messagesService: MessagesService,
    public route: ActivatedRoute,
    private autService: AuthService,
    public dialogRef: MatDialogRef<PostMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message) { }

  ngOnInit() {

    this.authStatusSub = this.autService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.messageForm = new FormGroup({
      nome: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(this.textareaPlaceHolder, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.mode = "mensagem";
    });
  }

  close(mensagem: any) {
    console.log("Enviando o nome: " + mensagem.nome)
    this.messagesService.addMessage(
      mensagem.nome,
      mensagem.phone,
      mensagem.content
    );
  }
  aclose(order: any){
    console.log(order)
  }

  onSaveMessage() {

    // https://stackoverflow.com/questions/47824920/angular-4-material-dialog-box-passing-in-array-of-object-to-dialog-box
    // https://www.freakyjolly.com/angular-material-dialog-modal-pass-data-between-parent-component-tutorial/#.Xvu9znVKhKU
    // https://www.google.com/search?sxsrf=ALeKk01K_ILc1FOYoDT004SNg7CVmcLIjw%3A1593555308884&ei=bLn7XqPJNYLC5OUPgruTsAg&q=How+to+pass+data+from+material+dialog+to+backend&oq=How+to+pass+data+from+material+dialog+to+backend&gs_lcp=CgZwc3ktYWIQAzoECAAQRzoICAAQCBAHEB46CAgAEAgQDRAeOgYIABAHEB46BggAEBYQHjoECCEQClCf7xVY6qUWYNimFmgBcAF4AIABkQGIAfIQkgEEMC4xN5gBAKABAaoBB2d3cy13aXo&sclient=psy-ab&ved=0ahUKEwijr_aQyKrqAhUCIbkGHYLdBIYQ4dUDCAw&uact=5
    // https://github.com/alex60217101990/Soccets/blob/850302f939524b123a241665ab59399207a5a45f/angular/app/app.component.ts
    
    console.log("nome -=-=-=-=->>>> " + this.messageForm.get('nome').value);
    console.log("nome -=-=-=-=->>>> " + this.messageForm.value.nome);
    this.isLoading = true;
    if (this.messageForm.invalid) {
      return;
    }
    this.messagesService.addMessage(
      this.messageForm.value.nome,
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

export class Person {
  nome = "ola"
  phone = "phone"
  content = "oioioi"

}