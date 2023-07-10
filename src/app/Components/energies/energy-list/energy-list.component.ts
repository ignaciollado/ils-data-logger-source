import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';

import { SharedService } from 'src/app/Services/shared.service';
import { EnergyService } from 'src/app/Services/energy.service';

@Component({
  selector: 'app-energy-list',
  templateUrl: './energy-list.component.html',
  styleUrls: ['./energy-list.component.scss']
})
export class EnergyListComponent {

  energies!: EnergyDTO[];
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;

  isGridView: boolean = false
  columnsDisplayed = ['nameES', 'nameCA', 'ACTIONS'];

  constructor(
    private energyService: EnergyService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.userId = '0';
    this.showButtons = false;
    this.access_token = this.localStorageService.get('access_token')

    /* if(this.access_token) { */
      this.loadEnergies();
   /*  } else {
      this.router.navigateByUrl('/login');
    } */
  }

  private loadEnergies(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {

        this.energyService.getAllEnergies().subscribe(
        (energies: EnergyDTO[]) => {
          console.log ( energies )
          this.energies = energies
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  deleteEnergy(energyId:number): void {

    this.loadEnergies()
  }

  createEnergy(): void {

  }

  updateEnergy(energyId:number): void {

  }

}
