import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-post-message',
    templateUrl: './post-message.component.html',
    styleUrls: ['./post-message.component.css']
})
export class PostMessageComponent implements OnInit, OnDestroy {

  isLoading = false;
  messageForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PostMessageComponent>
  ) {}

  ngOnInit() { }

  onSaveMessage() {
    console.log(this.messageForm.value)
  }

  ngOnDestroy() { }

}