import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle = "";
  enteredDiferencialOpt = "";
  enteredDescription = "";
  enteredPrice = "";
  enteredCondPrice = "";
  enteredIptuPrice = "";
  enteredType = "";
  enteredCity = "";
  enteredAddress = "";
  enteredEmCondominio = "";
  enteredAddressRef = "";
  enteredMetragemTerreno = "";
  enteredMetragemConstrucao = "";
  enteredVagas = "";
  enteredRooms = "";
  enteredBaths = "";
  enteredPermuta = "";
  enteredFinanciamento = "";

  enteredContactTelOne = "";
  enteredContactNameOne = "";
  enteredContactTelTwo = "";
  enteredContactNameTwo = "";
  
  enteredOwner = "";
  enteredTelOwner = "";
  enteredEmailOwner = "";  
  
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  corretorToggleUseDefault = false;

  private mode = "adicionar";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
      public postsService: PostsService,
      public route: ActivatedRoute,
      private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({

      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      diferencialOpt: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      condPrice: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      iptuPrice: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      type: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      address: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      emCondominio: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      addressRef: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      metragemTerreno: new FormControl(null, { validators: [Validators.required] }),
      metragemConstrucao: new FormControl(null, { validators: [Validators.required] }),
      vagas: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      rooms: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      baths: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      permuta: new FormControl(null, { validators: [Validators.required] }),
      financiamento: new FormControl(null, { validators: [Validators.required] }),

      contactTelOne: new FormControl(null, { validators: [Validators.required] }),
      contactNameOne: new FormControl(null, { validators: [Validators.required] }),
      contactTelTwo: new FormControl(null),
      contactNameTwo: new FormControl(null),
      
      owner: new FormControl(null, { validators: [Validators.required] }),
      telOwner: new FormControl(null, { validators: [Validators.required] }),
      emailOwner: new FormControl(null, { validators: [Validators.required] }),                 

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
              diferencialOpt: postData.diferencialOpt,
              description: postData.description,
              price: postData.price,
              condPrice: postData.condPrice,
              iptuPrice: postData.iptuPrice,
              type: postData.type,
              city: postData.city,
              address: postData.address,
              emCondominio: postData.emCondominio,
              addressRef: postData.addressRef,
              metragemTerreno: postData.metragemTerreno,
              metragemConstrucao: postData.metragemConstrucao,
              vagas: postData.vagas,
              rooms: postData.rooms,
              baths: postData.baths,
              permuta: postData.permuta,
              financiamento: postData.financiamento,
            
              contactTelOne: postData.contactTelOne,
              contactNameOne: postData.contactNameOne,
              contactTelTwo: postData.contactTelTwo,
              contactNameTwo: postData.contactNameTwo,
              
              owner: postData.contactNameTwo,
              telOwner: postData.contactNameTwo,
              emailOwner: postData.contactNameTwo,

              refNumber: postData.refNumber,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
            this.form.setValue({
              
              title: this.post.title,
              diferencialOpt: this.post.diferencialOpt,
              description: this.post.description,
              price: this.post.price,
              condPrice: this.post.condPrice,
              iptuPrice: this.post.iptuPrice,
              type: this.post.type,
              city: this.post.city,
              address: this.post.address,
              emCondominio: this.post.emCondominio,
              addressRef: this.post.addressRef,
              metragemTerreno: this.post.metragemTerreno,
              metragemConstrucao: this.post.metragemConstrucao,
              vagas: this.post.vagas,
              rooms: this.post.rooms,
              baths: this.post.baths,
              permuta: this.post.permuta,
              financiamento: this.post.financiamento,
            
              contactTelOne: this.post.contactTelOne,
              contactNameOne: this.post.contactNameOne,
              contactTelTwo: this.post.contactTelTwo,
              contactNameTwo: this.post.contactNameTwo,

              owner: this.post.owner,
              telOwner: this.post.telOwner,
              emailOwner: this.post.emailOwner,

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
    console.log(this.form.value.title);
    if (this.mode === "adicionar") {
      this.postsService.addPost(
        
        this.form.value.title,
        this.form.value.diferencialOpt,
        this.form.value.description,
        this.form.value.price,
        this.form.value.condPrice,
        this.form.value.iptuPrice,
        this.form.value.type,
        this.form.value.city,
        this.form.value.address,
        this.form.value.emCondominio,
        this.form.value.addressRef,
        this.form.value.metragemTerreno,
        this.form.value.metragemConstrucao,
        this.form.value.vagas,
        this.form.value.rooms,
        this.form.value.baths,
        this.form.value.permuta,
        this.form.value.financiamento,
        
        this.form.value.contactTelOne,
        this.form.value.contactNameOne,
        this.form.value.contactTelTwo,
        this.form.value.contactNameTwo,
        
        this.form.value.owner,
        this.form.value.telOwner,
        this.form.value.emailOwner,
        
        this.form.value.refNumber,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        
        this.form.value.title,
        this.form.value.diferencialOpt,
        this.form.value.description,
        this.form.value.price,
        this.form.value.condPrice,
        this.form.value.iptuPrice,
        this.form.value.type,
        this.form.value.city,
        this.form.value.address,
        this.form.value.emCondominio,
        this.form.value.addressRef,
        this.form.value.metragemTerreno,
        this.form.value.metragemConstrucao,
        this.form.value.vagas,
        this.form.value.rooms,
        this.form.value.baths,
        this.form.value.permuta,
        this.form.value.financiamento,
        
        this.form.value.contactTelOne,
        this.form.value.contactNameOne,
        this.form.value.contactTelTwo,
        this.form.value.contactNameTwo,
        
        this.form.value.owner,
        this.form.value.telOwner,
        this.form.value.emailOwner,

        this.form.value.refNumber,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  stepChanged(event, stepper){
    stepper.selected.interacted = false;
  }

  corretorToggle(event: MatSlideToggleChange) {
    this.corretorToggleUseDefault = event.checked;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}