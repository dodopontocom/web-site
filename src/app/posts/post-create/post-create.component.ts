import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model'
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    enteredName = '';
    enteredPhone = '';
    enteredContent = '';

    @Output() postCreated = new EventEmitter<Post>();

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const post: Post = {
            name: form.value.name,
            phone: form.value.phone,
            content: form.value.content
        };

        this.postCreated.emit(post);
    }
}