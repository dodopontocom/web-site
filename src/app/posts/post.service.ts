import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {

    private posts: Post[] = [];

    private postsUpdated = new Subject<Post[]>();
    
    getPosts() {
        return [...this.posts];
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(name: string, phone: string, content: string) {
        
        const post: Post = {name: name, phone: phone, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}