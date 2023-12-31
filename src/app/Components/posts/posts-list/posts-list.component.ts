import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { deleteResponse } from 'src/app/Services/post.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})

export class PostsListComponent implements OnInit{
  posts!: PostDTO[];
  consumptions!: ConsumptionDTO[];
  dataSource = new MatTableDataSource<ConsumptionDTO>()
  showButtons: boolean = false;
  isGridView: boolean = false
  columnsDisplayed: string[] = ['delegation', 'aspect', 'energy', 'residue', 'quantity', 'fromDate', 'toDate', 'ACTIONS'];
  columnsToDisplay: string[] = this.columnsDisplayed.slice();
  access_token: string | null = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatSort) sort: MatSort;

  addColumn() {
    const randomColumn = Math.floor(Math.random() * this.columnsDisplayed.length);
    this.columnsToDisplay.push(this.columnsDisplayed[randomColumn]);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.consumptions.filter( item => item.aspectES === filterValue.trim().toLowerCase() )
  }

  constructor(
    private consumptionService: ConsumptionService,
    private router: Router,
    private responsive: BreakpointObserver,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);
    this.access_token = sessionStorage.getItem("access_token")
    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {  showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
        this.loadPosts();
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

  private loadPosts(): void {
    let errorResponse: any;
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
        this.showButtons = true
        this.consumptionService.getAllConsumptionsByCompany(userId).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource = new MatTableDataSource<ConsumptionDTO>(this.consumptions)
          this.dataSource.sort = this.sort
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

  updatePost(consumptionId: string): void {
    this.router.navigateByUrl('/user/consumption/' + consumptionId);
  }

  deletePost(consumptionId: number): void {
    let errorResponse: any;
    let result = confirm('Confirm delete post with id: ' + consumptionId + ' .');
    if (result) {
      this.consumptionService.deleteConsumption(consumptionId).subscribe (
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadPosts();
    }
  }

  gridViewType(isGrid: boolean) {
    this.isGridView = isGrid
  }
}
