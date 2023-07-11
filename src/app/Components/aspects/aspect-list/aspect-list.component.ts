import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AspectDTO } from 'src/app/Models/aspect.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { AspectService } from 'src/app/Services/aspect.service';

@Component({
  selector: 'app-aspect-list',
  templateUrl: './aspect-list.component.html',
  styleUrls: ['./aspect-list.component.scss']
})

export class AspectListComponent {

  aspects!: AspectDTO[];
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;

  isGridView: boolean = false
  columnsDisplayed = ['nameES', 'nameCA', 'ACTIONS'];

  constructor(
    private aspectService: AspectService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.userId = '0';
    this.showButtons = false;
    this.access_token = this.localStorageService.get('access_token')

    /* if(this.access_token) { */
      this.loadAspects();
   /*  } else {
      this.router.navigateByUrl('/login');
    } */

  }

  private loadAspects(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {

        this.aspectService.getAllAspects().subscribe(
        (aspects: AspectDTO[]) => {
          console.log ( aspects )
          this.aspects = aspects
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  deleteAspect(aspectId:number): void {

    this.loadAspects()
  }

  createAspect(): void {
    this.router.navigateByUrl('createAspect');
  }

  updateAspect(aspectId:number): void {

  }

}
