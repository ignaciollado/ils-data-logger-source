import { HttpErrorResponse } from '@angular/common/http';
import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ResidueService } from 'src/app/Services/residue.service';
import { deleteResponse } from 'src/app/Services/residue.service'
import { SharedService } from 'src/app/Services/shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-residue-list',
  templateUrl: './residue-list.component.html',
  styleUrls: ['./residue-list.component.scss']
})
export class ResidueListComponent implements OnInit {

  residues!: ResidueDTO[];
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;

  isGridView: boolean = false
  columnsDisplayed: string[] = ['nameES', 'nameCA', 'ACTIONS'];

  constructor(
    private residueService: ResidueService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
    private responsive: BreakpointObserver
  ) {
    this.userId = '';
    this.showButtons = false;
    this.access_token = sessionStorage.getItem("access_token")

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false,  showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
        this.loadResidues();
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

  private loadResidues(): void {
    let errorResponse: any;
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
        this.showButtons = true;
        this.residueService.getAllResidues().subscribe(
        (residues: ResidueDTO[]) => {
          this.residues = residues
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  deleteResidue(residueId:number): void {

    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete the residue with id: ' + residueId + ' .');
    if (result) {
      this.residueService.deleteResidue(residueId).subscribe(
        (rowsAffected: deleteResponse ) => {
          if (rowsAffected.affected > 0) {
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
      this.loadResidues();
    }

  }

  createResidue(): void {
    this.router.navigateByUrl('createResidue');
  }

  updateResidue(residueId:number): void {

  }
}
