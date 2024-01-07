import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConsumptionDTO, graphConsumptionData } from 'src/app/Models/consumption.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import Chart from 'chart.js/auto';
import {ChartDataset, ChartType, ChartOptions} from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';

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

  primaryColors!: string[]
  alternateColors!: string[]
  graphMonths: string[]
  aspectEnergy: string
  aspectWater: string
  aspectResidue: string
  aspectEmissions: string
  aspectTitle: string

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
    this.alternateColors = [
      '#E8EAF6',
      '#C5CAE9',
      '#9FA8DA',
      '#7986CB',
      '#5C6BC0',
      '#3F51B5',
      '#3949AB',
      '#303F9F',
      '#283593',
      '#1A237E',
      ]
    this.primaryColors = [
      '#E8EAF6',
      '#F1F8E9',
      '#C5CAE9',
      '#DCEDC8',
      '#9FA8DA',
      '#C5E1A5',
      '#7986CB',
      '#AED581',
      '#5C6BC0',
      '#9CCC65',
      '#3F51B5',
      '#8BC34A',
      '#3949AB',
      '#7CB322',
      '#303F9F',
      '#689F38',
      '#283593',
      '#558B2F',
      '#1A237E',
      '#365446',
      '#8C9EFF',
      '#CCFF90',
      '#536DFE',
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
    let graphData: graphConsumptionData[] = []
    let myDatasets: any[] = []
    let startPrimaryColor: number = 18
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

    graphDataTemp.map((item:graphConsumptionData) => {
      graphData.push({
        'delegation': item.delegation,
        'energyName': item.energyName,
        'year': item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
      })
    })
    graphData.map(item=> {
      myDatasets.push(
          {
           label: item.year+" "+item.energyName,
           data: item.monthlyData,
           backgroundColor: this.primaryColors[startPrimaryColor--],
           stack: item.energyName,
           borderWidth: 0
          },
      )
    })

    myDatasets.push(
      {
        type: 'line',
        label: 'Objectives',
        data: ["45", "15", "45", "15", "45", "15", "15", "15", "45", "15", "15", "15"],
        backgroundColor: "#000000",
      }
    )

    console.log ("mi dataset: ", myDatasets)

    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: myDatasets
      },
      options: {
        responsive: true,
        aspectRatio:1.0,
        events: ['click'],
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                  size: 10,
                  family: 'Montserrat'
                    }
          }
          },
          title: {
            display: true,
            text: this.aspectTitle
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
  updateFields(e: any) {
    if (e.value == 1) {
      this.isEnergy = true
      this.aspectTitle = this.aspectEnergy
    } else {
      this.isEnergy = false
    }
    if (e.value == 2) {
      this.aspectTitle = this.aspectWater
    }
    if (e.value == 3) {
      this.isResidue = true
      this.aspectTitle = this.aspectResidue
    } else {
      this.isResidue = false
    }
    if(e.value == 5) {
      this.aspectTitle = this.aspectEmissions
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

  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };

  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };
}
