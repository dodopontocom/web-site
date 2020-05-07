import { Component } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    enteredName = '';
    enteredPhone = '';
    enteredContent = '';

    constructor(public postsService: PostsService) {}

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.postsService.addPost(form.value.name,form.value.phone,form.value.content);
        form.resetForm();
    }
}