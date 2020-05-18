import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  
  enteredName = "";
  enteredhone = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "adicionar";
  private postId: string;

    constructor(
        public postsService: PostsService,
        public route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
          name: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(3)]
          }),
          phone: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(11)]
          }),
          content: new FormControl(null, { validators: [Validators.required] }),
          image: new FormControl(null, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has("postId")) {
            this.mode = "edit";
            this.postId = paramMap.get("postId");
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = {
                  id: postData._id,
                  name: postData.name,
                  phone: postData.phone,
                  content: postData.content,
                  imagePath: postData.imagePath
                };
                this.form.setValue({
                  name: this.post.name,
                  phone: this.post.phone,
                  content: this.post.content,
                  image: this.post.imagePath
                });
            });
          } else {
            this.mode = "adicionar";
            this.postId = null;
          }
        });
      }

      onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ image: file });
        this.form.get("image").updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }

      onSavePost() {
        if (this.form.invalid) {
          return;
        }
        this.isLoading = true;
        if (this.mode === "adicionar") {
          this.postsService.addPost(
            this.form.value.name,
            this.form.value.phone,
            this.form.value.content,
            this.form.value.image
          );
        } else {
          this.postsService.updatePost(
            this.postId,
            this.form.value.name,
            this.form.value.phone,
            this.form.value.content,
            this.form.value.image
          );
        }
        this.form.reset();
      }
}