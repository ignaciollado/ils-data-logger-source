import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { deleteResponse } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})

export class PostsListComponent {
  posts!: PostDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'aspect', 'energy', 'residue', 'quantity', 'fromDate', 'toDate', 'ACTIONS'];

  constructor(
    private postService: PostService,
    private consumptionService: ConsumptionService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.loadPosts();
  }

  private loadPosts(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {

        this.consumptionService.getAllConsumptionsOnlyByUserIdFromMySQL(userId).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          console.log ( consumptions )
          this.consumptions = consumptions
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/consumption/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/consumption/' + postId);
  }

  deletePost(postId: string): void {
    alert (postId)
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.postService.deletePost(postId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadPosts();
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  gridViewType(isGrid: boolean) {
    this.isGridView = isGrid
  }
}
