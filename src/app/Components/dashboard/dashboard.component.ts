import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { SharedService } from 'src/app/Services/shared.service'
import Chart from 'chart.js/auto'
import { JwtHelperService } from '@auth0/angular-jwt'
import { HeaderMenusService } from 'src/app/Services/header-menus.service'
import { HeaderMenus } from 'src/app/Models/header-menus.dto'

import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { EnergyService } from 'src/app/Services/energy.service'
import { DelegationService } from 'src/app/Services/delegation.service'
import { ConsumptionService } from 'src/app/Services/consumption.service'
import { ResidueService } from 'src/app/Services/residue.service'
import { ObjectiveService } from 'src/app/Services/objective.service'
import { BillingService } from 'src/app/Services/billing.service'
import { ObjectiveColumns, ObjectiveDTO } from 'src/app/Models/objective.dto'
import { BillingColumns, BillingDTO } from 'src/app/Models/billing.dto'
import { EnergyDTO } from 'src/app/Models/energy.dto'
import { DelegationDTO } from 'src/app/Models/delegation.dto'
import { ConsumptionDTO, graphConsumptionData } from 'src/app/Models/consumption.dto'
import { ChapterItem, ResidueLERDTO } from 'src/app/Models/residueLER.dto'
import { CnaeDataDTO } from 'src/app/Models/cnaeData.dto'
import { CnaeDataService } from 'src/app/Services/cnaeData.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  consumptions!: ConsumptionDTO[]
  objectives!: ObjectiveDTO[]
  productionBilling!: BillingDTO[]
  productionCNAE!: CnaeDataDTO[]
  aspectConsumptions!: ConsumptionDTO[]
  aspect: UntypedFormControl
  delegation: UntypedFormControl
  yearGraph: UntypedFormControl
  ratioBillingGraph: UntypedFormControl
  ratioCNAEgGraph: UntypedFormControl
  graphForm: UntypedFormGroup
  energy: UntypedFormControl
  residue: UntypedFormControl
  residueFilter: FormControl<string> = new FormControl<string>('')
  energies!: EnergyDTO[]
  delegations!: DelegationDTO[]
  residues!: ResidueLERDTO[]
  residuesItem: ChapterItem[] = []
  private companyId: string | null
  isSearching: boolean = false
  isEnergy: Boolean = false
  isResidue: Boolean = false
  graphDataTemp: graphConsumptionData[]
  graphData: graphConsumptionData[] = []
  startPrimaryColor: number = 18
  theDataType: string = ''
  theRatios: number[] = []

  graphConsumption: graphConsumptionData[] = []

  quantityMaterials: number = 0

  chart: any

  primaryColors!: string[]
  alternateColors!: string[]
  graphMonths: string[]
  myDatasets: any[] = []
  aspectEnergy: string
  aspectWater: string
  aspectResidue: string
  aspectEmissions: string
  aspectTitle: string

  DISPLAY:boolean = true
  BORDER:boolean = true
  CHART_AREA:boolean = true
  TICKS:boolean = true
  isRatioBilling: boolean = false
  isRatioCNAE: boolean = false

  @Input() searching = false;

  constructor(
    private consumptionService: ConsumptionService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private delegationService: DelegationService,
    private residueService: ResidueService,
    private energyService: EnergyService,
    private objectiveService: ObjectiveService,
    private billingService: BillingService,
    private cnaesDataService: CnaeDataService,
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
      '#ff0000',
      '#636363',
      '#0000ff',
      '#644536',
      '#0BA9B7',
      '#FEEA00',
      '#d90429',
      '#ff006e',
      '#e6b609',
      '#00ff00',
      '#eae2b7',
      '#fcbf49',
      '#F18F01',
      '#d62828',
      '#1A237E',
      '#365446',
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
    this.ratioBillingGraph = new UntypedFormControl()
    this.ratioCNAEgGraph = new UntypedFormControl()
    this.energy = new UntypedFormControl('')
    this.residue = new UntypedFormControl('')

    this.graphForm = this.formBuilder.group({
      aspect: this.aspect,
      delegation: this.delegation,
      yearGraph: this.yearGraph,
      ratioBillingGraph: this.ratioBillingGraph,
      ratioCNAEgGraph: this.ratioCNAEgGraph,
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
    this.loadObjectives(this.companyId)
    this.loadProductionBilling(this.companyId)
    this.loadProductionCNAE(this.companyId)
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
                "water": consumption.water,
                "residueName": consumption.residueES,
                "emission": consumption.aspectES,
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
        this.chartGenerate()
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  private loadObjectives(companyId: string): void {
    let errorResponse: any;
    this.objectiveService.getAllObjectivesByCompany(companyId)
    .subscribe(
      (objectives: ObjectiveDTO[]) => {
        this.objectives = objectives
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  private loadProductionBilling(companyId: string): void {
    let errorResponse: any;
    this.billingService.getBillingsByCompany(companyId)
    .subscribe(
      (billings: BillingDTO[]) => {
        this.productionBilling = billings
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  private loadProductionCNAE(companyId: string): void {
    let errorResponse: any;
    this.cnaesDataService.getCnaesDataByCompany(companyId)
    .subscribe(
      (cnaes: CnaeDataDTO[]) => {
        this.productionCNAE = cnaes
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  chartGenerate() {
    if (this.chart) {
      this.chart.destroy()
    }

    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == this.aspect.value)
    this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearGraph.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearGraph.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }

    console.log("Los consumos: ", this.graphDataTemp)
    this.graphDataTemp.map((item:graphConsumptionData) => {
        switch ( this.aspect.value ) {
          case '1':
            this.theDataType = item.energyName
              break;
          case '2':
            this.theDataType = ''
              break;
          case '3':
            this.theDataType = item.residueName
              break;
          case '5':
            this.theDataType = ''
              break;
       }
      this.graphData.push({
        'delegation': item.delegation,
        'dataType': this.theDataType,
        'year': item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
      })
    })

    this.graphData.map(item=> {
      this.myDatasets.push(
          {
           label: item.year+" "+item.dataType,
           data: item.monthlyData,
           backgroundColor: this.primaryColors[this.startPrimaryColor--],
           stack: item.dataType,
           borderWidth: 0
          },
      )
    })

    if(this.isRatioBilling || this.isRatioCNAE) {
      this.chartObjective()
    }

    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: this.myDatasets
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

  chartObjective() {
    let theObjective: ObjectiveDTO[] = []
    theObjective = this.objectives.filter((item:any) => item.aspectId == this.aspect.value)
    theObjective = theObjective.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearGraph.value) {
      theObjective = theObjective.filter((item:any) => item.year == this.yearGraph.value)
    }
    if (this.energy.value) {
      theObjective = theObjective.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      theObjective = theObjective.filter((item:any) => item.energyName == this.residue.value)
    }
    console.log ("Los objetivos ", theObjective)
    
    this.myDatasets.push(
      {
        type: 'line',
        label: 'Objectives',
        data: theObjective,
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderWidth: .5,
        fill: false,
      }
    )
  }

  chartRatioBilling() {

    this.isRatioCNAE = false
    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == this.aspect.value)
    this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearGraph.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearGraph.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }
    console.log("Ratio billing: ", this.graphDataTemp)
    this.graphDataTemp.map((item:graphConsumptionData) => {
      switch ( this.aspect.value ) {
          case '1':
            this.theDataType = item.energyName
              break;
          case '2':
            this.theDataType = ''
              break;
          case '3':
            this.theDataType = item.residueName
              break;
          case '5':
            this.theDataType = ''
              break;
        }
      this.graphData.push({
        'delegation': item.delegation,
        'dataType': this.theDataType,
        'year': item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
        })
      })

      this.graphData.map(item=> {
        this.myDatasets.push(
            {
            label: item.year+" "+item.dataType,
            data: item.monthlyData,
            backgroundColor: this.primaryColors[this.startPrimaryColor--],
            stack: item.dataType,
            borderWidth: 0
            },
        )
      })

    this.chartObjective()
   
    this.myDatasets.push(
      {
        type: 'line',
        label: 'Ratios',
        data: this.theRatios,
        backgroundColor: '#FF9BD2',
        borderColor: '#FF9BD2',
        borderWidth: .5,
        fill: false,
      }
    )

    if (this.chart) {
      this.chart.destroy()
    }
    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: this.myDatasets
      },
      options: {
        responsive: true,
        aspectRatio:1.0,
        events: ['click'],
      }
    });
  }

  chartRatioCNAE() {
    this.isRatioBilling = false
    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == this.aspect.value)
    this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearGraph.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearGraph.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }
    console.log("Ratio CNAE ", this.graphDataTemp)
    this.graphDataTemp.map((item:graphConsumptionData) => {
        switch ( this.aspect.value ) {
          case '1':
            this.theDataType = item.energyName
              break;
          case '2':
            this.theDataType = ''
              break;
          case '3':
            this.theDataType = item.residueName
              break;
          case '5':
            this.theDataType = ''
              break;
        }
        this.graphData.push({
          'delegation': item.delegation,
          'dataType': this.theDataType,
          'year': item.year,
          'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
        })
      })

      this.graphData.map(item=> {
        this.myDatasets.push(
            {
            label: item.year+" "+item.dataType,
            data: item.monthlyData,
            backgroundColor: this.primaryColors[this.startPrimaryColor--],
            stack: item.dataType,
            borderWidth: 0
            },
        )
      })
      this.chartObjective()
 
    this.myDatasets.push(
      {
        type: 'line',
        label: 'Ratios',
        data: this.theRatios,
        backgroundColor: '#009BD2',
        borderColor: '#009BD2',
        borderWidth: .5,
        fill: false,
      }
    )

    if (this.chart) {
      this.chart.destroy()
    }
    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: this.myDatasets
      },
      options: {
        responsive: true,
        aspectRatio:1.0,
        events: ['click'],
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
    if (this.chart) {
      this.chart.destroy()
    }
  }

  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };

  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };
}
