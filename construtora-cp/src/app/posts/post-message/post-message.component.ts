import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-post-message',
    templateUrl: './post-message.component.html',
    styleUrls: ['./post-message.component.css']
})
export class PostMessageComponent implements OnInit, OnDestroy {

  isLoading = false;
  messageForm: FormGroup;
  textareaPlaceHolder: string = "Olá! Eu gostei deste anúncio. Pode me contatar pelo telefone fornecido à cima.";

  constructor(
    public dialogRef: MatDialogRef<PostMessageComponent>
  ) {}

  ngOnInit() {

    this.messageForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      phone: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      message: new FormControl(this.textareaPlaceHolder, { validators: [Validators.required] })
    });
  }

  onSaveMessage() {
    console.log(this.messageForm.value)
    if (this.messageForm.invalid) {
      return;
    }
  }

  ngOnDestroy() { }

}