import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

import { ResidueService } from 'src/app/Services/residue.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-residue-list',
  templateUrl: './residue-list.component.html',
  styleUrls: ['./residue-list.component.scss']
})
export class ResidueListComponent {
  residues!: ResidueDTO[];
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;

  isGridView: boolean = false
  columnsDisplayed = ['nameES', 'nameCA', 'ACTIONS'];

  constructor(
    private residueService: ResidueService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.userId = '0';
    this.showButtons = false;
    this.access_token = this.localStorageService.get('access_token')

    this.loadResidues();
  }

  private loadResidues(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {

        this.residueService.getAllResidues().subscribe(
        (residues: ResidueDTO[]) => {
          console.log ( residues )
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

    this.loadResidues()
  }

  createResidue(): void {
    this.router.navigateByUrl('createResidue');
  }

  updateResidue(residueId:number): void {

  }
}
