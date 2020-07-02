import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { Message } from "../message.model";
import { PostsService } from "../posts.service";
import { MessagesService } from "../messages.service";
import { AuthService } from "../../auth/auth.service";
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostMessageComponent } from '../post-message/post-message.component';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  messages: Message[] = [];
  
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private messagesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public messagesService: MessagesService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    
    this.messagesService.getMessages();
    console.log("00000> " + this.messagesService);
    this.messagesSub = this.messagesService
      .getMessageUpdateListener()
      .subscribe((messageData: { messages: Message[] }) => {
        this.isLoading = false;
        this.messages = messageData.messages;
      });
    
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    
      this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () =>  {
      this.isLoading = false;
    });
  }

  openDialog(ref: string) {
    console.log("ref: " + ref);
    // TODO - USAR ESSE REF AQUI PARA SALVAR QUAL EH O REFNUMBER
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "75%";

    dialogConfig.data = {
      nome: String,
      phone: String,
      content: String,
      ref: ref
    };
    console.log("ref: " + ref);

    let dialogRef = this.dialog.open(PostMessageComponent, dialogConfig);

    dialogRef.afterClosed().subscribe()

  }
  
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.messagesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
