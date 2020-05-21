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
  
  enteredTitle = "";
  enteredpPrice = "";
  enteredCity = "";
  enteredAddress = "";
  enteredMetragem = "";
  enteredRooms = "";
  enteredBaths = "";
  enteredPermuta = "";
  enteredType = "";
  enteredOwner = "";
  enteredContact = "";
  enteredDescription = "";
  
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

          title: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          price: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          city: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          address: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          metragem: new FormControl(null, { validators: [Validators.required] }),
          rooms: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          baths: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
          permuta: new FormControl(null, { validators: [Validators.required] }),
          type: new FormControl(null, { validators: [Validators.required] }),
          owner: new FormControl(null, { validators: [Validators.required] }),
          contact: new FormControl(null, { validators: [Validators.required] }),
          description: new FormControl(null, { validators: [Validators.required] }),

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
                  
                  title: postData.title,
                  price: postData.price,
                  city: postData.city,
                  address: postData.address,
                  metragem: postData.metragem,
                  rooms: postData.rooms,
                  baths: postData.baths,
                  permuta: postData.permuta,
                  type: postData.type,
                  owner: postData.owner,
                  contact: postData.contact,
                  description: postData.description,

                  imagePath: postData.imagePath,
                  creator: postData.creator
                };
                this.form.setValue({
                  
                  title: this.post.title,
                  price: this.post.price,
                  city: this.post.city,
                  address: this.post.address,
                  metragem: this.post.metragem,
                  rooms: this.post.rooms,
                  baths: this.post.baths,
                  permuta: this.post.permuta,
                  type: this.post.type,
                  owner: this.post.owner,
                  contact: this.post.contact,
                  description: this.post.description,

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
            
            this.form.value.title,
            this.form.value.price,
            this.form.value.city,
            this.form.value.address,
            this.form.value.metragem,
            this.form.value.rooms,
            this.form.value.baths,
            this.form.value.permuta,
            this.form.value.type,
            this.form.value.owner,
            this.form.value.contact,
            this.form.value.description,

            this.form.value.image
          );
        } else {
          this.postsService.updatePost(
            this.postId,
            
            this.form.value.title,
            this.form.value.price,
            this.form.value.city,
            this.form.value.address,
            this.form.value.metragem,
            this.form.value.rooms,
            this.form.value.baths,
            this.form.value.permuta,
            this.form.value.type,
            this.form.value.owner,
            this.form.value.contact,
            this.form.value.description,

            this.form.value.image
          );
        }
        this.form.reset();
      }
}