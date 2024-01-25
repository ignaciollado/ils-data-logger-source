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
import { ConsumptionDTO, graphData } from 'src/app/Models/consumption.dto'
import { ChapterItem, ResidueLERDTO } from 'src/app/Models/residueLER.dto'
import { CnaeDataDTO } from 'src/app/Models/cnaeData.dto'
import { CnaeDataService } from 'src/app/Services/cnaeData.service'
import { ResidueDTO } from 'src/app/Models/residue.dto'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private companyId: string | null

  aspect: UntypedFormControl
  delegation: UntypedFormControl
  yearGraph: UntypedFormControl
  ratioBillingGraph: UntypedFormControl
  ratioCNAEgGraph: UntypedFormControl
  graphForm: UntypedFormGroup
  energy: UntypedFormControl
  residue: UntypedFormControl
  residueFilter: FormControl<string> = new FormControl<string>('')
  energies: EnergyDTO[] = []
  energiesItemCompany: EnergyDTO[] = []
  energiesItemCompanyTemp: string[] = []
  delegations!: DelegationDTO[]
  residues!: ResidueLERDTO[]
  consumptions!: ConsumptionDTO[]
  objectives!: ObjectiveDTO[]
  productionBilling!: BillingDTO[]
  productionCNAE!: CnaeDataDTO[]
  aspectConsumptions!: ConsumptionDTO[]
  residuesItem: ChapterItem[] = []
  residuesItemCompany: ChapterItem[] = []
  residuesItemCompanyTemp: string[] = []

  graphDataTemp: graphData[]
  graphData: graphData[] = []
  myDatasets: any[] = []

  graphObjectiveTemp: ObjectiveDTO[]
  graphObjective: any[] = []
  objectiveDataSets: any[] = []
  startPrimaryColor: number
  theDataType: string = ''
  theRatios: number[] = []
  graphConsumption: graphData[] = []

  quantityMaterials: number = 0

  chart: any = new Chart("graph", {type: 'bar',
  data: {
     datasets: this.myDatasets
  }, })

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
  isRatioBilling: boolean = false
  isRatioCNAE: boolean = false
  isSearching: boolean = false
  isEnergy: Boolean = false
  isResidue: Boolean = false

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
    this.graphMonths = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ]
    this.aspectEnergy = "Energy (kWh)"
    this.aspectWater = "Water (L)"
    this.aspectResidue = "Residue (kg)"
    this.aspectEmissions = "Emissions (CO2e T)"

     if (localStorage.getItem('preferredLang') === 'cat') {
      //this.graphMonths = [ 'Gener', 'Febrer', 'Març', 'April', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre' ]
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Aigua (Litres)"
      this.aspectResidue = "Residu (Kg)"
      this.aspectEmissions = "Emissions (CO2e en T)"
    } else if (localStorage.getItem('preferredLang') === 'cas') {
      //this.graphMonths = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
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
    this.chartInit()
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
        this.residues.map(item => {
          item.chapters.map(subItem=> {
            subItem.chapterItems.map( (chapterItem: ChapterItem)=> {
              this.residuesItem = [...this.residuesItem, chapterItem]
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
    let errorResponse: any
    let equivEnKg: number = 1

    this.consumptionService.getAllConsumptionsByCompany(companyId)
    .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) =>
        {
          /*Cuando sea ENERGÍA (aspecto 1) Convierto todo a kWh */
          if (consumption.aspectId == "1") {
            this.energies.forEach((energy:EnergyDTO) => {
              if (energy.energyId === consumption.energy) {
                equivEnKg = energy.pci * energy.convLKg
              }
            })
            this.energiesItemCompanyTemp.push(consumption.energy)
          } 
          /*Cuando sea RESIDUO (aspecto 3) Filtro*/
          if (consumption.aspectId == "3") {
            this.residuesItemCompanyTemp.push(consumption.residueId)
          }
        
          this.graphConsumption.push(
            {"aspectId": consumption.aspectId,
                "delegation": consumption.delegation,
                "year": consumption.year,
                "energyName": consumption.energyES,
                "water": consumption.water,
                "residueName": consumption.residueId,
                "emission": consumption.aspectES,
                "jan": (consumption.jan*equivEnKg).toString(),
                "feb": (consumption.feb*equivEnKg).toString(),
                "mar": (consumption.mar*equivEnKg).toString(),
                "apr": (consumption.apr*equivEnKg).toString(),
                "may": (consumption.may*equivEnKg).toString(),
                "jun": (consumption.jun*equivEnKg).toString(),
                "jul": (consumption.jul*equivEnKg).toString(),
                "aug": (consumption.aug*equivEnKg).toString(),
                "sep": (consumption.sep*equivEnKg).toString(),
                "oct": (consumption.oct*equivEnKg).toString(),
                "nov": (consumption.nov*equivEnKg).toString(),
                "dec": (consumption.dec*equivEnKg).toString(),
                'monthlyData': [consumption.jan, consumption.feb, consumption.mar, consumption.apr, consumption.may, consumption.jun, consumption.jul, consumption.aug, consumption.sep, consumption.oct, consumption.nov, consumption.dec]
            })
        }
        )
        this.residuesItemCompany = this.residuesItem.filter((residueItem:any) => this.residuesItemCompanyTemp.includes(residueItem.chapterItemId))
        this.energiesItemCompany = this.energies.filter((energyItem:any) => this.energiesItemCompanyTemp.includes(energyItem[0]))
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


  chartInit() {

    this.myDatasets = []
    this.startPrimaryColor  = 19

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
    })

  }

  chartGenerate() {
    this.graphDataTemp = []
    this.graphData = []
    this.startPrimaryColor  = 19

    this.chart.destroy()
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

    this.graphDataTemp.map((item:graphData) => {
        switch ( this.aspect.value ) {
          case '1':
            this.theDataType = item.energyName
              break;
          case '2':
            this.theDataType = ''
              break;
          case '3':
            /* this.theDataType = item.residueName */
            this.residues.map( residueItem => {
              residueItem.chapters.map( (subItem:any)=> {
                subItem.chapterItems.forEach( (chapterItem: ChapterItem)=> {
                  if(chapterItem.chapterItemId === item.residueName) {
                    this.theDataType = chapterItem.chapterItemName
                  }
                })
              })
            })
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

    this.chart = new Chart("graph", {
      type: 'bar',
      data: {
         labels: this.graphMonths,
         datasets: this.myDatasets
      },
      options: {
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
      }
    })

  }

  chartRatioBilling() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.isRatioCNAE = false
    this.chartObjective()
    return;
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
    this.graphDataTemp.map((item:graphData) => {
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

    /* this.chartObjective() */

    this.myDatasets.push(
      {
        type: 'line',
        label: 'Ratios',
        data: this.theRatios,
        backgroundColor: '#ff0000',
        borderColor: '#00ff00',
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
    if (this.chart) {
      this.chart.destroy()
    }
    this.isRatioBilling = false
    this.chartObjective()
    return
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
    this.graphDataTemp.map((item:graphData) => {
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

    this.myDatasets.push(
      {
        type: 'line',
        label: 'Ratios',
        data: this.theRatios,
        backgroundColor: '#ff0000',
        borderColor: '#0000ff',
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

  chartObjective() {
    let theLabel: string = ''
    this.startPrimaryColor  = 19
    this.graphObjectiveTemp = this.objectives.filter((item:any) => item.aspectId == this.aspect.value)
    this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.isRatioBilling) {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any)=> item.theRatioRype = "Billing")
      theLabel = "Billing objective"
    } else {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.theRatioRype != 'Billing')
      theLabel = "CNAE objective"
    }
    if (this.yearGraph.value) {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.year == this.yearGraph.value)
    }

    console.log ("Los objetivos ", this.graphObjectiveTemp, this.isRatioBilling, this.isRatioCNAE)

    this.graphObjectiveTemp.map((item:ObjectiveDTO) => {
      this.graphObjective.push({
        'delegation': item.companyDelegationId,
        'dataType': this.theDataType,
        'year': item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
      })
    })
    this.graphObjective.map(item=> {
      this.myDatasets.push(
        {
          type: 'line',
          label: item.year+": "+theLabel,
          data: item.monthlyData,
          stack: item.dataType,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          borderColor: '#000000',
          borderWidth: .5,
          fill: false,
        },
      )
    })

    this.chart.update()
  }

  changeDelegation (e: any) {
    this.chart.destroy()
    this.myDatasets = []
    this.isEnergy = false
    this.isResidue = false
  }

  changeAspect(e: any) {
    this.chart.destroy()
    this.myDatasets = []

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

  selectionEnergyResidueChange(e: any) {
    this.chart.destroy()
    this.myDatasets = []
  }

  graphFormReset() {
    this.aspect.reset()
    this.delegation.reset()
    this.yearGraph.reset()
    this.energy.reset()
    this.residue.reset()
    this.isEnergy = false
    this.isResidue = false
    this.myDatasets = []
    this.chart.destroy()
  }

  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };

  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };
}
