import { Component, Input } from '@angular/core';
import { style } from '@angular/animations';

@Component ({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    // posts = [
    //     {title: 'First Post', content: 'This is first'},
    //     {title: 'second Post', content: 'This is second'},
    //     {title: 'third Post', content: 'This is third'}
    // ];

    @Input() posts = [];
}