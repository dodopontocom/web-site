import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    enteredName = '';
    enteredPhone = '';
    enteredContent = '';

    @Output() postCreated = new EventEmitter();

    onAddPost() {
        const post = {
            name: this.enteredName,
            phone: this.enteredPhone,
            content: this.enteredContent
        };

        this.postCreated.emit(post);
    }
}