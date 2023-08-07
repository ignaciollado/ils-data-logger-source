import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AspectDTO } from 'src/app/Models/aspect.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { AspectService } from 'src/app/Services/aspect.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-aspect-list',
  templateUrl: './aspect-list.component.html',
  styleUrls: ['./aspect-list.component.scss']
})

export class AspectListComponent implements OnInit{

  aspects!: AspectDTO[];
  showButtons: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  access_token: string | null;
  userId: string | null;

  isGridView: boolean = false
  columnsDisplayed = ['nameES', 'nameCA', 'ACTIONS'];

  constructor(
    private aspectService: AspectService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
    private responsive: BreakpointObserver
  ) {
    this.userId = '0'
    this.showButtons = false
    this.access_token = sessionStorage.getItem("access_token")
    this.showAuthSection = false;
    this.showNoAuthSection = true;

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
        this.loadAspects()
      } else {
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo)
        this.router.navigateByUrl('login')
      }
    }
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
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
          this.isGridView = true
        }
        if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.isGridView = true
        } 
        if (breakpoints[Breakpoints.TabletLandscape]) {
          this.isGridView = false
        } 
        if (breakpoints[Breakpoints.HandsetLandscape]) {
          this.isGridView = false
        }
  });
  
  }

  private loadAspects(): void {
    let errorResponse: any;
    const userId = sessionStorage.getItem('user_id');
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
    let errorResponse: any;
    let result = confirm('Confirm delete the aspect with id: ' + aspectId + ' .');
    if (result) {

      this.aspectService.deleteAspect(aspectId).subscribe(
        (rowsAffected: deleteResponse ) => {
          if (rowsAffected.affected > 0) {
          }
        },
        (error: HttpErrorResponse) => { 
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
      this.loadAspects();
    }
  }

  createAspect(): void {
    this.router.navigateByUrl('createAspect');
  }

  updateAspect(aspectId:number): void {

  }

}
