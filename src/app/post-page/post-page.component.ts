import {Component, OnInit} from '@angular/core';
import {PostsService} from '../shared/posts.service';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../shared/interfaces';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  post$: Observable<Post>;

  constructor(private postService: PostsService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.post$ = this.route.params
      .pipe(switchMap((params) => {
        return this.postService.getById(params.id);
      }));

  }

}
