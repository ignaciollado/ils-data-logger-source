import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AspectDTO } from 'src/app/Models/aspect.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { AspectService } from 'src/app/Services/aspect.service';

@Component({
  selector: 'app-aspect-list',
  templateUrl: './aspect-list.component.html',
  styleUrls: ['./aspect-list.component.scss']
})

export class AspectListComponent implements OnInit{

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
    private headerMenusService: HeaderMenusService,
    private responsive: BreakpointObserver
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

  ngOnInit(): void {
    
    this.responsive.observe([
          Breakpoints.TabletPortrait /*  (min-width: 600px) and (max-width: 839.98px) and (orientation: portrait) */, 
          Breakpoints.HandsetPortrait /* (max-width: 599.98px) and (orientation: portrait) */,
          Breakpoints.TabletLandscape /* (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape) */,
          Breakpoints.HandsetLandscape /* (max-width: 959.98px) and (orientation: landscape) */
          /*  Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
          Breakpoints.Handset */
          ])
      .subscribe(result => {

        const breakpoints = result.breakpoints;

        if (breakpoints[Breakpoints.TabletPortrait]) {
          console.log("screens matches TabletPortrait");
          this.isGridView = true
        }
        if (breakpoints[Breakpoints.HandsetPortrait]) {
          console.log("screens matches HandsetPortrait");
          this.isGridView = true
        } 
        if (breakpoints[Breakpoints.TabletLandscape]) {
          console.log("screens matches TabletLandscape");
          this.isGridView = false
        } 
        if (breakpoints[Breakpoints.HandsetLandscape]) {
          console.log("screens matches HandsetLandscape");
          this.isGridView = false
        }
  });
  
  }

  private loadAspects(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
        this.showButtons = true
        this.aspectService.getAllAspects().subscribe(
        (aspects: AspectDTO[]) => {
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
