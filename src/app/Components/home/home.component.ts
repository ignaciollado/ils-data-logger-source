import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { EnergyService } from 'src/app/Services/energy.service';

import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  consumptions!: ConsumptionDTO[];
  energies!: EnergyDTO[];
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;

  constructor(
    private consumptionService: ConsumptionService,
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
      this.loadConsumptions();
      this.loadEnergies();
   /*  } else {
      this.router.navigateByUrl('/login');
    } */

  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private loadConsumptions(): void {
    let errorResponse: any;
    this.userId = this.localStorageService.get('user_id');
    if (this.userId) {
      this.showButtons = true;
      this.consumptionService.getAllConsumptionsByCompany(this.userId).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    } else {
    this.consumptionService.getAllConsumptions().subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions;
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
    }
  }

  private loadEnergies(): void {
    let errorResponse: any;
    this.energyService.getAllEnergies().subscribe(
      (energies:EnergyDTO[]) => {
        this.energies = energies
      }
    )
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/consumption/' + postId);
  }

  deletePost(postId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.consumptionService.deleteConsumptions(postId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadConsumptions();
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

}
