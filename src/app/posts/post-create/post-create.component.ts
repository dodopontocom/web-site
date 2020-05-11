import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from '../posts.service';
import { Post } from "../post.model";


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = "create";
  private postId: string;

    constructor(
        public postsService: PostsService,
        public route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has("postId")) {
            this.mode = "edit";
            this.postId = paramMap.get("postId");
            this.isLoading = true;
            this.postsService.getPosts(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = {
                  id: postData._id,
                  name: postData.name,
                  phone: postData.phone,
                  content: postData.content};
            });
          } else {
            this.mode = "adicionar";
            this.postId = null;
          }
        });
      }
    
      onSavePost(form: NgForm) {
        if (form.invalid) {
          return;
        }
        this.isLoading = true;
        if (this.mode === "adicionar") {
          this.postsService.addPost(form.value.name, form.value.phone, form.value.content);
        } else {
          this.postsService.updatePost(
            this.postId,
            form.value.title,
            form.value.phone,
            form.value.content
          );
        }
        form.resetForm();
      }
}