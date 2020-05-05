import { Component, OnInit, OnDestroy } from '@angular/core';
//import { style } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component ({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent  implements OnInit, OnDestroy {
    
    posts: Post[] = [];
    private postsSub: Subscription;

    constructor(public postsServices: PostsService) {}

    ngOnInit() {
        this.posts = this.postsServices.getPosts();
        this.postsSub = this.postsServices.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
            });
    }
    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}