import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { EnergyService } from 'src/app/Services/energy.service';

import { SharedService } from 'src/app/Services/shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService
  ) {
    this.userId = '0'
    this.showButtons = false
    this.access_token = sessionStorage.getItem("access_token")
    sessionStorage.removeItem("preferredLang")
    if(sessionStorage.getItem("preferredLang") === 'undefined' || sessionStorage.getItem("preferredLang") === null) {
      sessionStorage.setItem("preferredLang", "cat")
    }    
    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {  showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
        this.loadConsumptions()
        this.loadEnergies()
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
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private loadConsumptions(): void {
    let errorResponse: any;
    this.userId = this.jwtHelper.decodeToken().id_ils
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

  goToDetail(id:number) {
    alert (id)
  }
}
