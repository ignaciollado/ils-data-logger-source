import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConsumptionDTO, graphConsumptionData } from 'src/app/Models/consumption.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import Chart from 'chart.js/auto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { Router } from '@angular/router';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { EnergyService } from 'src/app/Services/energy.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { ChapterItem, ResidueLERDTO } from 'src/app/Models/residueLER.dto';
import { ResidueService } from 'src/app/Services/residue.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  consumptions!: ConsumptionDTO[]
  aspectConsumptions!: ConsumptionDTO[]
  aspect: UntypedFormControl
  delegation: UntypedFormControl
  yearGraph: UntypedFormControl
  graphForm: UntypedFormGroup
  energy: UntypedFormControl
  residue: UntypedFormControl
  residueFilter: FormControl<string> = new FormControl<string>('')
  energies!: EnergyDTO[]
  delegations!: DelegationDTO[]
  residues!: ResidueLERDTO[];
  residuesItem: ChapterItem[] = []
  private companyId: string | null
  isSearching: boolean = false
  isEnergy: Boolean = false
  isResidue: Boolean = false

  graphConsumption: graphConsumptionData[] = []
  quantity2GraphEnergy: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity15GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity16GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity6GraphEnergy: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity18GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity5GraphEnergy: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity14GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  ratioPersona14GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  ratioBilling14GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]

  quantity19GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity20GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity21GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity23GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity22GraphEnergy:number[] = [0,0,0,0,0,0,0,0,0,0,0,0]

  quantity1GraphResidue:   number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity2GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity3GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity4GraphResidue:   number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity5GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity6GraphResidue:   number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity7GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity8GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity9GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity10GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity11GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity12GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity13GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
  quantity14GraphResidue:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]

  quantityWater:  number[] = [0,0,0,0,0,0,0,0,0,0,0,0]

  quantityWaterJanuary : number = 0
  quantityWaterFebruary : number = 0
  quantityWaterMarch : number = 0
  quantityWaterApril : number = 0
  quantityWaterMay : number = 0
  quantityWaterJune : number = 0
  quantityWaterJuly : number = 0
  quantityWaterAugust : number = 0
  quantityWaterSeptember : number = 0
  quantityWaterOctober : number = 0
  quantityWaterNovember : number = 0
  quantityWaterDecember : number = 0

  quantityEmissions2021ScopeOne: number = 0
  quantityEmissions2022ScopeOne: number = 0
  quantityEmissions2023ScopeOne: number = 0
  quantityEmissions2024ScopeOne: number = 0

  quantityEmissions2021ScopeTwo: number = 0
  quantityEmissions2022ScopeTwo: number = 0
  quantityEmissions2023ScopeTwo: number = 0
  quantityEmissions2024ScopeTwo: number = 0

  quantityMaterials: number = 0

  chart: any

  allBackgroundColors!: string[]
  allBorderColors!: string[]
  graphMonths: string[]
  aspectEnergy: string
  aspectWater: string
  aspectResidue: string
  aspectEmissions: string

  DISPLAY:boolean = true
  BORDER:boolean = true
  CHART_AREA:boolean = true
  TICKS:boolean = true
  @Input() searching = false;
  constructor(
    private consumptionService: ConsumptionService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private delegationService: DelegationService,
    private residueService: ResidueService,
    private energyService: EnergyService,
    private formBuilder: UntypedFormBuilder,
    private jwtHelper: JwtHelperService
  ) {
    this.allBackgroundColors = [
      '#E0F7FA',
      '#B2EBF2',
      '#80DEEA',
      '#4DD0E1',
      '#26C6DA',
      '#00BCD4',
      '#00ACC1',
      '#0097A7',
      '#00838F',
      '#006064',
      '#84FFFF',
      '#18FFFF'
      ]
    this.allBorderColors = [
      '#F1F8E9',
      '#DCEDC8',
      '#C5E1A5',
      '#AED581',
      '#9CCC65',
      '#8BC34A',
      '#7CB342',
      '#689F38',
      '#558B2F',
      '#33691E',
      '#CCFF90',
      '#B2FF59'
      ]
    this.companyId = this.jwtHelper.decodeToken().id_ils;    
    this.graphMonths = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    this.aspectEnergy = "Energy (kWh)"
    this.aspectWater = "Water (Liters)"
    this.aspectResidue = "Residue (Kg)"
    this.aspectEmissions = "Emissions (CO2e in T)"

    if (localStorage.getItem('preferredLang') === 'cat') {
      this.graphMonths = [ 'Gener', 'Febrer', 'Març', 'April', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre' ]
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Aigua (Litres)"
      this.aspectResidue = "Residu (Kg)"
      this.aspectEmissions = "Emissions (CO2e en T)"
    } else if (localStorage.getItem('preferredLang') === 'cas') {
      this.graphMonths = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ]      
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Agua (Litros)"
      this.aspectResidue = "Residuo (Kg)"
      this.aspectEmissions = "Emisiones (CO2e en T)"
    }

    this.aspect = new UntypedFormControl('', [ Validators.required ])
    this.delegation = new UntypedFormControl('', [ Validators.required ])
    this.yearGraph = new UntypedFormControl('')
    this.energy = new UntypedFormControl('')
    this.residue = new UntypedFormControl('')

    this.graphForm = this.formBuilder.group({
      aspect: this.aspect,
      delegation: this.delegation,
      yearGraph: this.yearGraph,
      energy: this.energy,
      residue: this.residue,

    });

  }

  ngOnInit(): void {
    const access_token: string | null = sessionStorage.getItem("access_token")
    
      if (!this.jwtHelper.isTokenExpired (access_token)) {
        const headerInfo: HeaderMenus = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo)
      }
      this.loadEnergies()
      this.loadResidues()
      this.loadDelegations(this.companyId)
      this.loadconsumptions(this.companyId)
  }

  private loadEnergies(): void {
    let errorResponse: any;
    if (this.companyId) {
      this.energyService.getAllEnergies().subscribe(
        (energies: EnergyDTO[]) => {
          this.energies = energies;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadResidues(): void {
    let errorResponse: any; 
    this.residueService.getResiduesLER()
    .subscribe(
      (residues: ResidueLERDTO[]) => {
        this.residues = residues;
        this.residues.map( item => {
          item.chapters.map( subItem=> {
            subItem.chapterItems.map( (subSubItem: ChapterItem)=> {
              this.residuesItem = [...this.residuesItem, subSubItem]
            })
          })
          this.residuesItem
        })

      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      } 
    )
  }

  private loadDelegations(companyId: string): void {
    let errorResponse: any;
    if (companyId) {
      this.delegationService.getAllDelegationsByCompanyIdFromMySQL(companyId).subscribe(
        (delegations: DelegationDTO[]) => {
          this.delegations = delegations;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadconsumptions(companyId: string): void {
    let dateFromDate: Date;
    let dateToDate: Date;
    let dateYearInsert: Date;
    let mmFrom: number;
    let mmTo: number;
    let yyFrom: number;
    let yyTo: number;
    let errorResponse: any;
    
    this.consumptionService.getAllConsumptionsByCompany(companyId)
    .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) => 
        {
          this.graphConsumption.push( 
            {"aspectId": consumption.aspectId, 
                "delegation": consumption.delegation,
                "year": consumption.year,
                "energyName": consumption.energyES,
                "jan": consumption.jan,
                "feb": consumption.feb,
                "mar": consumption.mar,
                "apr": consumption.apr,
                "may": consumption.may,
                "jun": consumption.jun,
                "jul": consumption.jul,
                "aug": consumption.aug,
                "sep": consumption.sep,
                "oct": consumption.oct,
                "nov": consumption.nov,
                "dec": consumption.dec,
            })

         /*  dateFromDate = new Date(consumption.fromDate)
          dateToDate = new Date(consumption.toDate)
          dateYearInsert = new Date(consumption.created_at)
          mmFrom = dateFromDate.getMonth()+1
          mmTo = dateToDate.getMonth()+1
          yyFrom = dateFromDate.getFullYear()
          yyTo = dateToDate.getFullYear() */

            if ( consumption.aspectId == 1 ) { /* ENERGY */
             /*  if ( mmFrom == 1 && mmTo == 1 ) {
              switch ( +consumption.energy ) {
                case 2:
                  this.quantity2GraphEnergy[0] = this.quantity2GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 5:
                  this.quantity5GraphEnergy[0] = this.quantity5GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 6:
                  this.quantity6GraphEnergy[0] = this.quantity6GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 14:
                  this.quantity14GraphEnergy[0] = this.quantity14GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  this.ratioPersona14GraphEnergy[0] = this.ratioPersona14GraphEnergy[0] + (this.quantity14GraphEnergy[0]/+consumption.objective)
                  this.ratioBilling14GraphEnergy[0] = this.ratioBilling14GraphEnergy[0] + (this.quantity14GraphEnergy[0]/+consumption.objective)
                  break
                case 15:
                  this.quantity15GraphEnergy[0] = this.quantity15GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break                
                case 16:
                  this.quantity16GraphEnergy[0] = this.quantity16GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 18:
                  this.quantity18GraphEnergy[0] = this.quantity18GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 19:
                  this.quantity19GraphEnergy[0] = this.quantity19GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 20:
                  this.quantity20GraphEnergy[0] = this.quantity20GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 21:
                  this.quantity21GraphEnergy[0] = this.quantity21GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 22:
                  this.quantity22GraphEnergy[0] = this.quantity22GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                case 23:
                  this.quantity23GraphEnergy[0] = this.quantity23GraphEnergy[0] + (+consumption.quantity*consumption.pci)
                  break
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 2 && mmTo == 2 ) {
              switch ( +consumption.energy ) {
                case 2:
                  this.quantity2GraphEnergy[1] = this.quantity2GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 5:
                  this.quantity5GraphEnergy[1] = this.quantity5GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 6:
                  this.quantity6GraphEnergy[1] = this.quantity6GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 14:
                  this.quantity14GraphEnergy[1] = this.quantity14GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  this.ratioPersona14GraphEnergy[1] = this.ratioPersona14GraphEnergy[1] + (this.quantity14GraphEnergy[1]/+consumption.objective)
                  this.ratioBilling14GraphEnergy[1] = this.ratioBilling14GraphEnergy[1] + (this.quantity14GraphEnergy[1]/+consumption.objective)
                  break
                case 15:
                  this.quantity15GraphEnergy[1] = this.quantity15GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break                
                case 16:
                  this.quantity16GraphEnergy[1] = this.quantity16GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 18:
                  this.quantity18GraphEnergy[1] = this.quantity18GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 19:
                  this.quantity19GraphEnergy[1] = this.quantity19GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 20:
                  this.quantity20GraphEnergy[1] = this.quantity20GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 21:
                  this.quantity21GraphEnergy[1] = this.quantity21GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 22:
                  this.quantity22GraphEnergy[1] = this.quantity22GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                case 23:
                  this.quantity23GraphEnergy[1] = this.quantity23GraphEnergy[1] + (+consumption.quantity*consumption.pci)
                  break
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 3 && mmTo == 3 ) {
              switch ( +consumption.energy ) {
                case 2:
                  this.quantity2GraphEnergy[2] = this.quantity2GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 5:
                  this.quantity5GraphEnergy[2] = this.quantity5GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 6:
                  this.quantity6GraphEnergy[2] = this.quantity6GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 14:
                  this.quantity14GraphEnergy[2] = this.quantity14GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  this.ratioPersona14GraphEnergy[2] = this.ratioPersona14GraphEnergy[2] + (this.quantity14GraphEnergy[2]/+consumption.objective)
                  this.ratioBilling14GraphEnergy[2] = this.ratioBilling14GraphEnergy[2] + (this.quantity14GraphEnergy[2]/+consumption.objective)
                  break
                case 15:
                  this.quantity15GraphEnergy[2] = this.quantity15GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break                
                case 16:
                  this.quantity16GraphEnergy[2] = this.quantity16GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 18:
                  this.quantity18GraphEnergy[2] = this.quantity18GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 19:
                  this.quantity19GraphEnergy[2] = this.quantity19GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 20:
                  this.quantity20GraphEnergy[2] = this.quantity20GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 21:
                  this.quantity21GraphEnergy[2] = this.quantity21GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 22:
                  this.quantity22GraphEnergy[2] = this.quantity22GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                case 23:
                  this.quantity23GraphEnergy[2] = this.quantity23GraphEnergy[2] + (+consumption.quantity*consumption.pci)
                  break
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 4 && mmTo == 4 ) {
              switch ( +consumption.energy ) {
                case 2:
                  this.quantity2GraphEnergy[3] = this.quantity2GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 5:
                  this.quantity5GraphEnergy[3] = this.quantity5GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 6:
                  this.quantity6GraphEnergy[3] = this.quantity6GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 14:
                  this.quantity14GraphEnergy[3] = this.quantity14GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  this.ratioPersona14GraphEnergy[3] = this.ratioPersona14GraphEnergy[3] + (this.quantity14GraphEnergy[3]/+consumption.objective)
                  this.ratioBilling14GraphEnergy[3] = this.ratioBilling14GraphEnergy[3] + (this.quantity14GraphEnergy[3]/+consumption.objective)
                  break
                case 15:
                  this.quantity15GraphEnergy[3] = this.quantity15GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break                
                case 16:
                  this.quantity16GraphEnergy[3] = this.quantity16GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 18:
                  this.quantity18GraphEnergy[3] = this.quantity18GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 19:
                  this.quantity19GraphEnergy[3] = this.quantity19GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 20:
                  this.quantity20GraphEnergy[3] = this.quantity20GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 21:
                  this.quantity21GraphEnergy[3] = this.quantity21GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 22:
                  this.quantity22GraphEnergy[3] = this.quantity22GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                case 23:
                  this.quantity23GraphEnergy[3] = this.quantity23GraphEnergy[3] + (+consumption.quantity*consumption.pci)
                  break
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 5 && mmTo == 5 ) {
              switch ( +consumption.energy ) {
                case 2:
                  this.quantity2GraphEnergy[4] = this.quantity2GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 5:
                  this.quantity5GraphEnergy[4] = this.quantity5GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 6:
                  this.quantity6GraphEnergy[4] = this.quantity6GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 14:
                  this.quantity14GraphEnergy[4] = this.quantity14GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  this.ratioPersona14GraphEnergy[4] = this.ratioPersona14GraphEnergy[4] + (this.quantity14GraphEnergy[4]/+consumption.objective)
                  this.ratioBilling14GraphEnergy[4] = this.ratioBilling14GraphEnergy[4] + (this.quantity14GraphEnergy[4]/+consumption.objective)
                  break
                case 15:
                  this.quantity15GraphEnergy[4] = this.quantity15GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break                
                case 16:
                  this.quantity16GraphEnergy[4] = this.quantity16GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 18:
                  this.quantity18GraphEnergy[4] = this.quantity18GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 19:
                  this.quantity19GraphEnergy[4] = this.quantity19GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 20:
                  this.quantity20GraphEnergy[4] = this.quantity20GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 21:
                  this.quantity21GraphEnergy[4] = this.quantity21GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 22:
                  this.quantity22GraphEnergy[4] = this.quantity22GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                case 23:
                  this.quantity23GraphEnergy[4] = this.quantity23GraphEnergy[4] + (+consumption.quantity*consumption.pci)
                  break
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 6 && mmTo == 6 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[5] = this.quantity2GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[5] = this.quantity5GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[5] = this.quantity6GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[5] = this.quantity14GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[5] = this.ratioPersona14GraphEnergy[5] + (this.quantity14GraphEnergy[5]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[5] = this.ratioBilling14GraphEnergy[5] + (this.quantity14GraphEnergy[5]/+consumption.objective)
                    break
                  case 14:
                    this.quantity15GraphEnergy[5] = this.quantity15GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[5] = this.quantity16GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[5] = this.quantity18GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[5] = this.quantity19GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[5] = this.quantity20GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[5] = this.quantity21GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[5] = this.quantity22GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[5] = this.quantity23GraphEnergy[5] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 7 && mmTo == 7 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[6] = this.quantity2GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[6] = this.quantity5GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[6] = this.quantity6GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[6] = this.quantity14GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[6] = this.ratioPersona14GraphEnergy[6] + (this.quantity14GraphEnergy[6]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[6] = this.ratioBilling14GraphEnergy[6] + (this.quantity14GraphEnergy[6]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[6] = this.quantity15GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[6] = this.quantity16GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[6] = this.quantity18GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[6] = this.quantity19GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[6] = this.quantity20GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[6] = this.quantity21GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[6] = this.quantity22GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[6] = this.quantity23GraphEnergy[6] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 8 && mmTo == 8 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[7] = this.quantity2GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[7] = this.quantity5GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[7] = this.quantity6GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[7] = this.quantity14GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[7] = this.ratioPersona14GraphEnergy[7] + (this.quantity14GraphEnergy[7]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[7] = this.ratioBilling14GraphEnergy[7] + (this.quantity14GraphEnergy[7]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[7] = this.quantity15GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[7] = this.quantity16GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[7] = this.quantity18GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[7] = this.quantity19GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[7] = this.quantity20GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[7] = this.quantity21GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[7] = this.quantity22GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[7] = this.quantity23GraphEnergy[7] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 9 && mmTo == 9 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[9] = this.quantity2GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[8] = this.quantity5GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[8] = this.quantity6GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[8] = this.quantity14GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[8] = this.ratioPersona14GraphEnergy[8] + (this.quantity14GraphEnergy[8]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[9] = this.ratioBilling14GraphEnergy[9] + (this.quantity14GraphEnergy[9]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[8] = this.quantity15GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[8] = this.quantity16GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[8] = this.quantity18GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[8] = this.quantity19GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[8] = this.quantity20GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[8] = this.quantity21GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[8] = this.quantity22GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[8] = this.quantity23GraphEnergy[8] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 10 && mmTo == 10 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[9] = this.quantity2GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[9] = this.quantity5GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[9] = this.quantity6GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[9] = this.quantity14GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[9] = this.ratioPersona14GraphEnergy[9] + (this.quantity14GraphEnergy[9]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[10] = this.ratioBilling14GraphEnergy[10] + (this.quantity14GraphEnergy[10]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[9] = this.quantity15GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[9] = this.quantity16GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[9] = this.quantity18GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[9] = this.quantity19GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[9] = this.quantity20GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[9] = this.quantity21GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[9] = this.quantity22GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[9] = this.quantity23GraphEnergy[9] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 11 && mmTo == 11 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[10] = this.quantity2GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[10] = this.quantity5GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[10] = this.quantity6GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[10] = this.quantity14GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[10] = this.ratioPersona14GraphEnergy[10] + (this.quantity14GraphEnergy[10]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[10] = this.ratioBilling14GraphEnergy[10] + (this.quantity14GraphEnergy[10]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[10] = this.quantity15GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[10] = this.quantity16GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[10] = this.quantity18GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[10] = this.quantity19GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[10] = this.quantity20GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[10] = this.quantity21GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[10] = this.quantity22GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[10] = this.quantity23GraphEnergy[10] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 12 && mmTo == 12 ) {
                switch ( +consumption.energy ) {
                  case 2:
                    this.quantity2GraphEnergy[11] = this.quantity2GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 5:
                    this.quantity5GraphEnergy[11] = this.quantity5GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 6:
                    this.quantity6GraphEnergy[11] = this.quantity6GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 14:
                    this.quantity14GraphEnergy[11] = this.quantity14GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    this.ratioPersona14GraphEnergy[11] = this.ratioPersona14GraphEnergy[11] + (this.quantity14GraphEnergy[11]/+consumption.objective)
                    this.ratioBilling14GraphEnergy[11] = this.ratioBilling14GraphEnergy[11] + (this.quantity14GraphEnergy[11]/+consumption.objective)
                    break
                  case 15:
                    this.quantity15GraphEnergy[11] = this.quantity15GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break                
                  case 16:
                    this.quantity16GraphEnergy[11] = this.quantity16GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 18:
                    this.quantity18GraphEnergy[11] = this.quantity18GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 19:
                    this.quantity19GraphEnergy[11] = this.quantity19GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 20:
                    this.quantity20GraphEnergy[11] = this.quantity20GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 21:
                    this.quantity21GraphEnergy[11] = this.quantity21GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 22:
                    this.quantity22GraphEnergy[11] = this.quantity22GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  case 23:
                    this.quantity23GraphEnergy[11] = this.quantity23GraphEnergy[11] + (+consumption.quantity*consumption.pci)
                    break
                  default:
                    console.log("no matching case found when logged in")
                }
              } */
            }
            if ( consumption.aspectId == 2 ) { /* WATER */
            if (mmFrom == 1 && mmTo == 1) {
              this.quantityWater[0] = this.quantityWater[0] + (+consumption.quantity)
              }
            if (mmFrom == 2 && mmTo == 2) {
              this.quantityWater[1] = this.quantityWater[1] + (+consumption.quantity)
              }
            if (mmFrom == 3 && mmTo == 3) {
              this.quantityWater[2] = this.quantityWater[2] + (+consumption.quantity)
              }
            if (mmFrom == 4 && mmTo == 4) {
              this.quantityWater[3] = this.quantityWater[3] + (+consumption.quantity)
              }
            if (mmFrom == 5 && mmTo == 5) {
              this.quantityWater[4] = this.quantityWater[4] + (+consumption.quantity)
              }
            if (mmFrom == 6 && mmTo == 6) {
              this.quantityWater[5] = this.quantityWater[5] + (+consumption.quantity)
              }
            if (mmFrom == 7 && mmTo == 7) {
              this.quantityWater[6] = this.quantityWater[6] + (+consumption.quantity)
              }
            if (mmFrom == 8 && mmTo == 8) {
              this.quantityWater[7] = this.quantityWater[7] + (+consumption.quantity)
              }
            if (mmFrom == 9 && mmTo == 9) {
              this.quantityWater[8] = this.quantityWater[8] + (+consumption.quantity)
              }
            if (mmFrom == 10 && mmTo == 10) {
              this.quantityWater[9] = this.quantityWater[9] + (+consumption.quantity)
              }
            if (mmFrom == 11 && mmTo == 11) {
              this.quantityWater[10] = this.quantityWater[10] + (+consumption.quantity)
              }
            if (mmFrom == 12 && mmTo == 12) {
              this.quantityWater[11] = this.quantityWater[11] + (+consumption.quantity)
              }
            }
            if ( consumption.aspectId == 3 ) { /* RESIDUE */

              if ( mmFrom == 1 && mmTo == 1 ) {
              switch ( +consumption.residueId ) {
                case 1:
                  this.quantity1GraphResidue[0] = this.quantity1GraphResidue[0] + (+consumption.quantity)
                  break
                case 2:
                  this.quantity2GraphResidue[0] = this.quantity2GraphResidue[0] + (+consumption.quantity)
                  break
                case 3:
                  this.quantity3GraphResidue[0] = this.quantity3GraphResidue[0] + (+consumption.quantity)
                  break
                case 4:
                  this.quantity4GraphResidue[0] = this.quantity4GraphResidue[0] + (+consumption.quantity)
                  break
                case 5:
                  this.quantity5GraphResidue[0] = this.quantity5GraphResidue[0] + (+consumption.quantity)
                  break                
                case 6:
                  this.quantity6GraphResidue[0] = this.quantity6GraphResidue[0] + (+consumption.quantity)
                  break
                case 7:
                  this.quantity7GraphResidue[0] = this.quantity7GraphResidue[0] + (+consumption.quantity)
                  break
                case 8:
                  this.quantity8GraphResidue[0] = this.quantity8GraphResidue[0] + (+consumption.quantity)
                  break
                case 9:
                  this.quantity9GraphResidue[0] = this.quantity9GraphResidue[0] + (+consumption.quantity)
                  break
                case 10:
                  this.quantity10GraphResidue[0] = this.quantity10GraphResidue[0] + (+consumption.quantity)
                  break
                case 11:
                  this.quantity11GraphResidue[0] = this.quantity11GraphResidue[0] + (+consumption.quantity)
                  break
                case 12:
                  this.quantity12GraphResidue[0] = this.quantity12GraphResidue[0] + (+consumption.quantity)
                  break
                case 13:
                  this.quantity13GraphResidue[0] = this.quantity13GraphResidue[0] + (+consumption.quantity)
                  break
                case 14:
                  this.quantity14GraphResidue[0] = this.quantity14GraphResidue[0] + (+consumption.quantity)
                  break                                    
                default:
                  console.log("no matching case found when logged in")
              }
              }
              if ( mmFrom == 2 && mmTo == 2 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[1] = this.quantity1GraphResidue[1] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[1] = this.quantity2GraphResidue[1] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[1] = this.quantity3GraphResidue[1] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[1] = this.quantity4GraphResidue[1] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[1] = this.quantity5GraphResidue[1] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[1] = this.quantity6GraphResidue[1] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[1] = this.quantity7GraphResidue[1] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[1] = this.quantity8GraphResidue[1] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[1] = this.quantity9GraphResidue[1] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[1] = this.quantity10GraphResidue[1] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[1] = this.quantity11GraphResidue[1] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[1] = this.quantity12GraphResidue[1] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[1] = this.quantity13GraphResidue[1] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[1] = this.quantity14GraphResidue[1] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 3 && mmTo == 3 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[2] = this.quantity1GraphResidue[2] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[2] = this.quantity2GraphResidue[2] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[2] = this.quantity3GraphResidue[2] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[2] = this.quantity4GraphResidue[2] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[2] = this.quantity5GraphResidue[2] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[2] = this.quantity6GraphResidue[2] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[2] = this.quantity7GraphResidue[2] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[2] = this.quantity8GraphResidue[2] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[2] = this.quantity9GraphResidue[2] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[2] = this.quantity10GraphResidue[2] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[2] = this.quantity11GraphResidue[2] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[2] = this.quantity12GraphResidue[2] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[2] = this.quantity13GraphResidue[2] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[2] = this.quantity14GraphResidue[2] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 4 && mmTo == 4 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[3] = this.quantity1GraphResidue[3] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[3] = this.quantity2GraphResidue[3] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[3] = this.quantity3GraphResidue[3] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[3] = this.quantity4GraphResidue[3] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[3] = this.quantity5GraphResidue[3] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[3] = this.quantity6GraphResidue[3] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[3] = this.quantity7GraphResidue[3] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[3] = this.quantity8GraphResidue[3] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[3] = this.quantity9GraphResidue[3] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[3] = this.quantity10GraphResidue[3] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[3] = this.quantity11GraphResidue[3] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[3] = this.quantity12GraphResidue[3] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[3] = this.quantity13GraphResidue[3] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[3] = this.quantity14GraphResidue[3] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 5 && mmTo == 5 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[4] = this.quantity1GraphResidue[4] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[4] = this.quantity2GraphResidue[4] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[4] = this.quantity3GraphResidue[4] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[4] = this.quantity4GraphResidue[4] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[4] = this.quantity5GraphResidue[4] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[4] = this.quantity6GraphResidue[4] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[4] = this.quantity7GraphResidue[4] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[4] = this.quantity8GraphResidue[4] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[4] = this.quantity9GraphResidue[4] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[4] = this.quantity10GraphResidue[4] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[4] = this.quantity11GraphResidue[4] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[4] = this.quantity12GraphResidue[4] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[4] = this.quantity13GraphResidue[4] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[4] = this.quantity14GraphResidue[4] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 6 && mmTo == 6 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[5] = this.quantity1GraphResidue[5] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[5] = this.quantity2GraphResidue[5] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[5] = this.quantity3GraphResidue[5] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[5] = this.quantity4GraphResidue[5] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[5] = this.quantity5GraphResidue[5] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[5] = this.quantity6GraphResidue[5] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[5] = this.quantity7GraphResidue[5] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[5] = this.quantity8GraphResidue[5] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[5] = this.quantity9GraphResidue[5] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[5] = this.quantity10GraphResidue[5] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[5] = this.quantity11GraphResidue[5] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[5] = this.quantity12GraphResidue[5] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[5] = this.quantity13GraphResidue[5] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[5] = this.quantity14GraphResidue[5] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 7 && mmTo == 7 ) {
                console.log(mmFrom, mmTo, consumption.residueId, consumption.quantity)
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[6] = this.quantity1GraphResidue[6] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[6] = this.quantity2GraphResidue[6] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[6] = this.quantity3GraphResidue[6] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[6] = this.quantity4GraphResidue[6] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[6] = this.quantity5GraphResidue[6] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[6] = this.quantity6GraphResidue[6] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[6] = this.quantity7GraphResidue[6] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[6] = this.quantity8GraphResidue[6] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[6] = this.quantity9GraphResidue[6] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[6] = this.quantity10GraphResidue[6] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[6] = this.quantity11GraphResidue[6] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[6] = this.quantity12GraphResidue[6] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[6] = this.quantity13GraphResidue[6] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[6] = this.quantity14GraphResidue[6] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 8 && mmTo == 8 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[7] = this.quantity1GraphResidue[7] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[7] = this.quantity2GraphResidue[7] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[7] = this.quantity3GraphResidue[7] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[7] = this.quantity4GraphResidue[7] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[7] = this.quantity5GraphResidue[7] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[7] = this.quantity6GraphResidue[7] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[7] = this.quantity7GraphResidue[7] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[7] = this.quantity8GraphResidue[7] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[7] = this.quantity9GraphResidue[7] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[7] = this.quantity10GraphResidue[7] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[7] = this.quantity11GraphResidue[7] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[7] = this.quantity12GraphResidue[7] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[7] = this.quantity13GraphResidue[7] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[7] = this.quantity14GraphResidue[7] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 9 && mmTo == 9 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[8] = this.quantity1GraphResidue[8] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[8] = this.quantity2GraphResidue[8] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[8] = this.quantity3GraphResidue[8] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[8] = this.quantity4GraphResidue[8] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[8] = this.quantity5GraphResidue[8] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[8] = this.quantity6GraphResidue[8] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[8] = this.quantity7GraphResidue[8] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[8] = this.quantity8GraphResidue[8] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[8] = this.quantity9GraphResidue[8] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[8] = this.quantity10GraphResidue[8] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[8] = this.quantity11GraphResidue[8] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[8] = this.quantity12GraphResidue[8] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[8] = this.quantity13GraphResidue[8] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[8] = this.quantity14GraphResidue[8] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 10 && mmTo == 10 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[9] = this.quantity1GraphResidue[9] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[9] = this.quantity2GraphResidue[9] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[9] = this.quantity3GraphResidue[9] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[9] = this.quantity4GraphResidue[9] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[9] = this.quantity5GraphResidue[9] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[9] = this.quantity6GraphResidue[9] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[9] = this.quantity7GraphResidue[9] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[9] = this.quantity8GraphResidue[9] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[9] = this.quantity9GraphResidue[9] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[9] = this.quantity10GraphResidue[9] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[9] = this.quantity11GraphResidue[9] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[9] = this.quantity12GraphResidue[9] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[9] = this.quantity13GraphResidue[9] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[9] = this.quantity14GraphResidue[9] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 11 && mmTo == 11 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[10] = this.quantity1GraphResidue[10] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[10] = this.quantity2GraphResidue[10] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[10] = this.quantity3GraphResidue[10] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[10] = this.quantity4GraphResidue[10] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[10] = this.quantity5GraphResidue[10] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[10] = this.quantity6GraphResidue[10] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[10] = this.quantity7GraphResidue[10] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[10] = this.quantity8GraphResidue[10] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[10] = this.quantity9GraphResidue[10] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[10] = this.quantity10GraphResidue[10] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[10] = this.quantity11GraphResidue[10] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[10] = this.quantity12GraphResidue[10] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[10] = this.quantity13GraphResidue[10] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[10] = this.quantity14GraphResidue[10] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
              if ( mmFrom == 12 && mmTo == 12 ) {
                switch ( +consumption.residueId ) {
                  case 1:
                    this.quantity1GraphResidue[11] = this.quantity1GraphResidue[11] + (+consumption.quantity)
                    break
                  case 2:
                    this.quantity2GraphResidue[11] = this.quantity2GraphResidue[11] + (+consumption.quantity)
                    break
                  case 3:
                    this.quantity3GraphResidue[11] = this.quantity3GraphResidue[11] + (+consumption.quantity)
                    break
                  case 4:
                    this.quantity4GraphResidue[11] = this.quantity4GraphResidue[11] + (+consumption.quantity)
                    break
                  case 5:
                    this.quantity5GraphResidue[11] = this.quantity5GraphResidue[11] + (+consumption.quantity)
                    break                
                  case 6:
                    this.quantity6GraphResidue[11] = this.quantity6GraphResidue[11] + (+consumption.quantity)
                    break
                  case 7:
                    this.quantity7GraphResidue[11] = this.quantity7GraphResidue[11] + (+consumption.quantity)
                    break
                  case 8:
                    this.quantity8GraphResidue[11] = this.quantity8GraphResidue[11] + (+consumption.quantity)
                    break
                  case 9:
                    this.quantity9GraphResidue[11] = this.quantity9GraphResidue[11] + (+consumption.quantity)
                    break
                  case 10:
                    this.quantity10GraphResidue[11] = this.quantity10GraphResidue[11] + (+consumption.quantity)
                    break
                  case 11:
                    this.quantity11GraphResidue[11] = this.quantity11GraphResidue[11] + (+consumption.quantity)
                    break
                  case 12:
                    this.quantity12GraphResidue[11] = this.quantity12GraphResidue[11] + (+consumption.quantity)
                    break
                  case 13:
                    this.quantity13GraphResidue[11] = this.quantity13GraphResidue[11] + (+consumption.quantity)
                    break
                  case 14:
                    this.quantity14GraphResidue[11] = this.quantity14GraphResidue[11] + (+consumption.quantity)
                    break                                    
                  default:
                    console.log("no matching case found when logged in")
                }
              }
            }
            if ( consumption.aspectId == 4 ) { /* MATERIALS */
                this.quantityMaterials = this.quantityMaterials + +consumption.quantity
            }
            if ( consumption.aspectId == 5 ) { /* EMISSIONS */
            if (yyFrom == 2021 && yyTo == 2021) {
              this.quantityEmissions2021ScopeOne = this.quantityEmissions2021ScopeOne + (+consumption.scopeOne)
              this.quantityEmissions2021ScopeTwo = this.quantityEmissions2021ScopeTwo + (+consumption.scopeTwo)
              }
            if (yyFrom == 2022 && yyTo == 2022) {
              this.quantityEmissions2022ScopeOne = this.quantityEmissions2022ScopeOne + (+consumption.scopeOne)
              this.quantityEmissions2022ScopeTwo = this.quantityEmissions2022ScopeTwo + (+consumption.scopeTwo)
              }
            if (yyFrom == 2023 && yyTo == 2023) {
              this.quantityEmissions2023ScopeOne = this.quantityEmissions2023ScopeOne + (+consumption.scopeOne)
              this.quantityEmissions2023ScopeTwo = this.quantityEmissions2023ScopeTwo + (+consumption.scopeTwo)
              }
            if (yyFrom == 2024 && yyTo == 2024) {
              this.quantityEmissions2024ScopeOne = this.quantityEmissions2024ScopeOne + (+consumption.scopeOne)
              this.quantityEmissions2024ScopeTwo = this.quantityEmissions2024ScopeTwo + (+consumption.scopeTwo)
              }              
            }
        }
        )
        this.chartEnergy();
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  chartEnergy() {
    let graphDataTemp: graphConsumptionData[];
    let  graphData: number[] = [0,0,0,0,0,0,0,0,0,0,0,0]
    if (this.chart) {
      this.chart.destroy()
    }
    graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == this.aspect.value)
    graphDataTemp = graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearGraph.value) {
      graphDataTemp = graphDataTemp.filter((item:any) => item.year == this.yearGraph.value)
    }
    if (this.energy.value) {
      graphDataTemp = graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      graphDataTemp = graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }
    graphDataTemp.map(item => {
      graphData[0] = +item.jan,
      graphData[1] = +item.feb,
      graphData[2] = +item.mar,
      graphData[3] = +item.apr,
      graphData[4] = +item.may,
      graphData[5] = +item.jun,
      graphData[6] = +item.jul,
      graphData[7] = +item.aug,
      graphData[8] = +item.sep,
      graphData[9] = +item.oct,
      graphData[10] = +item.nov,
      graphData[11] = +item.dec
    })

    console.log (graphDataTemp, graphData)
    
    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: [
           {
            label: '2019',
            data: graphData,
            backgroundColor: this.allBackgroundColors[0],
            borderColor: this.allBorderColors[0],
            stack: 'year',
            borderWidth: 1
           },
           {
            label: '2020',
            data: [50, 75, 50, 25, 50, 75, 15, 45, 40, 35, 25, 35],
            backgroundColor: this.allBackgroundColors[1],
            borderColor: this.allBorderColors[1],
            stack: 'year',
            borderWidth: 1
          },
          {
            label: '2021',
            data: [50, 75, 50, 35, 50, 75, 15, 85, 40, 35, 25, 65],
            backgroundColor: this.allBackgroundColors[2],
            borderColor: this.allBorderColors[2],
            stack: 'year',
            borderWidth: 1
          },
           {
            type: 'line',
            label: 'Objectives',
            data: [45, 15, 45, 15, 45, 15, 15, 15, 45, 15, 15, 15],
            borderColor: "#000000",
           }
         ] 
      },
      options: {
        responsive: true,
        aspectRatio:1.0,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: this.aspectResidue
          }
        },
        
         scales: {
          x: {
            border: {
              display: this.BORDER
            },
            grid: {
              display: this.DISPLAY,
              drawOnChartArea: this.CHART_AREA,
              drawTicks: this.TICKS,
            }

          },
          y: {

          }
        } 
      }
    });
  }

  private chartWater() {

    this.chart = new Chart("graph", {

      data: {
        labels:  this.graphMonths,
        datasets: [
          {
            type: 'bar',
            label: "Water",
            data: this.quantityWater,
            backgroundColor: this.allBackgroundColors[5],
            borderColor: this.allBorderColors[5],
            borderWidth: 1
          }, {
            type: 'line',
            label: 'Ratios Dataset',
            data: [50, 75, 50, 25, 50, 75],
        }
        ]
      },
      options: {
        responsive: true,
        aspectRatio:2.0,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: this.aspectWater
          }
        }
      }
    });
  }

  private chartResidue() {
    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
        labels:  this.graphMonths,
        datasets: [
          {
            label: "Urbano mezclado",
            data: this.quantity1GraphResidue,
            backgroundColor: this.allBackgroundColors[0],
            borderColor: this.allBorderColors[0],
            borderWidth: 1
          },
          {
            label: "Papel/cartón",
            data: this.quantity2GraphResidue,
            backgroundColor: this.allBackgroundColors[1],
            borderColor: this.allBorderColors[1],
            borderWidth: 1
          },
          {
            label: "Plástico",
            data: this.quantity3GraphResidue,
            backgroundColor: this.allBackgroundColors[2],
            borderColor: this.allBorderColors[2],
            borderWidth: 1
          },
          {
            label: "Vidrio",
            data: this.quantity4GraphResidue,
            backgroundColor: this.allBackgroundColors[3],
            borderColor: this.allBorderColors[3],
            borderWidth: 1
          },
          {
            label: "Metálicos",
            data: this.quantity5GraphResidue,
            backgroundColor: this.allBackgroundColors[4],
            borderColor: this.allBorderColors[4],
            borderWidth: 1
          },
          {
            label: "Madera",
            data: this.quantity6GraphResidue,
            backgroundColor: this.allBackgroundColors[5],
            borderColor: this.allBorderColors[5],
            borderWidth: 1
          },
          {
            label: "Vegetales",
            data: this.quantity7GraphResidue,
            backgroundColor: this.allBackgroundColors[6],
            borderColor: this.allBorderColors[6],
            borderWidth: 1
          },
          {
            label: "Animales",
            data: this.quantity8GraphResidue,
            backgroundColor: this.allBackgroundColors[7],
            borderColor: this.allBorderColors[7],
            borderWidth: 1
          },
          {
            label: "Productos alimentarios",
            data: this.quantity9GraphResidue,
            backgroundColor: this.allBackgroundColors[8],
            borderColor: this.allBorderColors[8],
            borderWidth: 1
          },
          {
            label: "Lodos no contaminados",
            data: this.quantity10GraphResidue,
            backgroundColor: this.allBackgroundColors[9],
            borderColor: this.allBorderColors[9],
            borderWidth: 1
          },
          {
            label: "Combustión no peligrosos",
            data: this.quantity11GraphResidue,
            backgroundColor: this.allBackgroundColors[10],
            borderColor: this.allBorderColors[10],
            borderWidth: 1
          },
          {
            label: "Construcción y demolición (obra)",
            data: this.quantity12GraphResidue,
            backgroundColor: this.allBackgroundColors[11],
            borderColor: this.allBorderColors[11],
            borderWidth: 1
          },
          {
            label: "Peligrosos",
            data: this.quantity13GraphResidue,
            backgroundColor: this.allBackgroundColors[12],
            borderColor: this.allBorderColors[12],
            borderWidth: 1
          },
          {
            label: "Otros",
            data: this.quantity14GraphResidue,
            backgroundColor: this.allBackgroundColors[13],
            borderColor: this.allBorderColors[13],
            borderWidth: 1
          },           
        ]
      },
      options: {
        responsive: true,
        aspectRatio:2.0,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: this.aspectResidue
          }
        },
        
         scales: {
          x: {
            border: {
              display: this.BORDER
            },
            grid: {
              display: this.DISPLAY,
              drawOnChartArea: this.CHART_AREA,
              drawTicks: this.TICKS,
            }

          },
          y: {

          }
        } 
      }
    });
  }

  private chartEmission() {
    this.chart = new Chart("graph", {
      type: 'pie',
      data: {
       
        labels:  [ 'CO2e Emissions SCOPE one (T)','CO2e Emissions SCOPE two (T)' ],
        datasets: [
          {
            label: "2021",
            data: [ this.quantityEmissions2021ScopeOne, this.quantityEmissions2021ScopeTwo ],
            backgroundColor: [ '#b9936c', '#dac292'],
          /*   borderColor: ['rgba(0, 0, 255, 1.0)', 'rgba(0, 255, 0, 1.0)'],
            borderWidth: 1 */
          },
          {
            label: "2022",
            data: [ this.quantityEmissions2022ScopeOne, this.quantityEmissions2022ScopeTwo ],
            backgroundColor: [ '#b9936c', '#dac292'],
           /*  borderColor: ['rgba(0, 0, 255, 1.0)', 'rgba(0, 255, 0, 1.0)'],
            borderWidth: 1 */
          },
          {
            label: "2023",
            data: [ this.quantityEmissions2023ScopeOne, this.quantityEmissions2023ScopeTwo ],
            backgroundColor: [ '#b9936c', '#dac292'],
           /*  borderColor: ['rgba(0, 0, 255, 1.0)', 'rgba(0, 255, 0, 1.0)'],
            borderWidth: 1 */
          },
        ]
      },
      options: {
          responsive: true,
          aspectRatio:2.0,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: this.aspectEmissions
            }
          },
         /*  scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          } */
        }
    });
  }

  updateFields(e: any) {
    console.log ("el valor es:", e.value)
    if (e.value == 1) {
     this.isEnergy = true
    } else {
      this.isEnergy = false
    }
    if (e.value == 3) {
      this.isResidue = true
    } else {
      this.isResidue = false
    }
  }

  graphFormReset() {
    this.aspect.reset()
    this.delegation.reset()
    this.yearGraph.reset()
    this.energy.reset()
    this.residue.reset()
    this.isEnergy = false
    this.isResidue = false
  }
}
