import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model'

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

    onAddPost() {
        const post: Post = {
            name: this.enteredName,
            phone: this.enteredPhone,
            content: this.enteredContent
        };

        this.postCreated.emit(post);
    }
}