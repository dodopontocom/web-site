import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
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

  message: Message;
  isLoading = false;
  messageForm: FormGroup;
  
  postsPerPage = 5;
  currentPage = 1;

  ref: string;

  posts: Post[] = [];
  private postsSub: Subscription;

  private mode = "mensagem";
  private authStatusSub: Subscription;

  textareaPlaceHolder: string = "Olá! Eu gostei deste anúncio. Pode me contatar pelo telefone fornecido à cima.";

  constructor(
    public messagesService: MessagesService,
    public postsService: PostsService,
    public route: ActivatedRoute,
    private autService: AuthService,
    public dialogRef: MatDialogRef<PostMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) {
      this.ref = data.ref;
    }

  ngOnInit() {
    
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
      });

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

  // TODO USAR SNACKBAR PARA ENVIAR SUCESSO

  openSnackBar() {
    this._snackBar.open("Mensagem enviada com sucesso", ";)", {
      duration: 2000,
    });
  }

  close(mensagem: any) {
    this.isLoading = true;
    if (this.messageForm.invalid) {
      return;
    }

    console.log("--ref----->" + this.ref);
    this.messagesService.addMessage(
      mensagem.nome,
      mensagem.phone,
      mensagem.content,
      this.ref
    );
    this.isLoading = false;
    this.messageForm.reset();    
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
   }

}
