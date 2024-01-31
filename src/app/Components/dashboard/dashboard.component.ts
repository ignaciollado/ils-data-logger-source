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

  delegation: UntypedFormControl
  yearEnergy: UntypedFormControl
  ratioBillingGraphE: UntypedFormControl
  ratioCNAEgGraphE: UntypedFormControl
  yearWiewGraphE: UntypedFormControl
  trimestralViewGraphE: UntypedFormControl
  monthlyViewGraphE: UntypedFormControl
  energyGraphForm: UntypedFormGroup
  waterGraphForm: UntypedFormGroup
  residueGraphForm: UntypedFormGroup
  emissionGraphForm: UntypedFormGroup

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
  graphQuarters: string[]
  graphYears: string[]
  aspectEnergy: string
  aspectWater: string
  aspectResidue: string
  aspectEmissions: string
  aspectTitle: string

  DISPLAY:boolean = true
  BORDER:boolean = true
  CHART_AREA:boolean = true
  TICKS:boolean = true
  isRatioBillingE: boolean = false
  isRatioCNAEE: boolean = false
  isSearching: boolean = false
  isEnergy: boolean = false
  isResidue: boolean = false
  isYearViewE : boolean = true 
  isQuarterlyViewE : boolean = false
  isMonthlyViewE : boolean = false
  isKWViewE : boolean = false
  isMWViewE : boolean = false

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
    this.graphQuarters = [ 'Q1', 'Q2', 'Q3', 'Q4' ]
    this.graphYears = [ '2019', '2020', '2021', '2022', '2023', '2024', '2025' ]


    this.aspectEnergy = "Energy (kWh)"
    this.aspectWater = "Water (L)"
    this.aspectResidue = "Residue (kg)"
    this.aspectEmissions = "Emissions (CO2e T)"

     if (localStorage.getItem('preferredLang') === 'cat') {
      //this.graphMonths = [ 'Gener', 'Febrer', 'Març', 'April', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre' ]
      this.graphQuarters = [ 'T1', 'T2', 'T3', 'T4' ]
      this.aspectEnergy = "Energia (kWh)"
      this.aspectWater = "Aigua (L)"
      this.aspectResidue = "Residu (kg)"
      this.aspectEmissions = "Emissions (CO2e en T)"
    } else if (localStorage.getItem('preferredLang') === 'cas') {
      //this.graphMonths = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre' ]
      this.graphQuarters = [ 'T1', 'T2', 'T3', 'T4' ]
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Agua (L)"
      this.aspectResidue = "Residuo (kg)"
      this.aspectEmissions = "Emisiones (CO2e en T)"
    } 

    this.delegation = new UntypedFormControl('')
    this.yearEnergy = new UntypedFormControl('')
    this.ratioBillingGraphE = new UntypedFormControl()
    this.ratioCNAEgGraphE = new UntypedFormControl()
    this.trimestralViewGraphE = new UntypedFormControl()
    this.yearWiewGraphE = new UntypedFormControl()
    this.monthlyViewGraphE = new UntypedFormControl()
    this.energy = new UntypedFormControl('')
    this.residue = new UntypedFormControl('')

    this.energyGraphForm = this.formBuilder.group({
      delegation: this.delegation,
      yearEnergy: this.yearEnergy,
      ratioBillingGraphE: this.ratioBillingGraphE,
      ratioCNAEgGraphE: this.ratioCNAEgGraphE,
      energy: this.energy,
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
    this.loadgraphDataEnergy(this.companyId)
    //this.chartEnergyGenerate()
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
            //this.energiesItemCompanyTemp.push(consumption.energy)
          } 
          /*Cuando sea RESIDUO (aspecto 3) Filtro, sólo los del usuario, para el desplegable*/
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
                "jan": (consumption.jan*equivEnKg),
                "feb": (consumption.feb*equivEnKg),
                "mar": (consumption.mar*equivEnKg),
                "apr": (consumption.apr*equivEnKg),
                "may": (consumption.may*equivEnKg),
                "jun": (consumption.jun*equivEnKg),
                "jul": (consumption.jul*equivEnKg),
                "aug": (consumption.aug*equivEnKg),
                "sep": (consumption.sep*equivEnKg),
                "oct": (consumption.oct*equivEnKg),
                "nov": (consumption.nov*equivEnKg),
                "dec": (consumption.dec*equivEnKg),
                'monthlyData': [consumption.jan*equivEnKg, consumption.feb*equivEnKg, consumption.mar*equivEnKg, consumption.apr*equivEnKg, consumption.may*equivEnKg, consumption.jun*equivEnKg, consumption.jul*equivEnKg, consumption.aug*equivEnKg, consumption.sep*equivEnKg, consumption.oct*equivEnKg, consumption.nov*equivEnKg, consumption.dec*equivEnKg],
                'quarterlyData': [(consumption.jan*equivEnKg + consumption.feb*equivEnKg + consumption.mar*equivEnKg), (consumption.apr*equivEnKg + consumption.may*equivEnKg + consumption.jun*equivEnKg), (consumption.jul*equivEnKg + consumption.aug*equivEnKg + consumption.sep*equivEnKg), (consumption.oct*equivEnKg + consumption.nov*equivEnKg + consumption.dec*equivEnKg)],
                'yearlyData': consumption.jan*equivEnKg+consumption.feb*equivEnKg+consumption.mar*equivEnKg+consumption.apr*equivEnKg+consumption.may*equivEnKg+consumption.jun*equivEnKg+consumption.jul*equivEnKg+consumption.aug*equivEnKg+consumption.sep*equivEnKg+consumption.oct*equivEnKg+consumption.nov*equivEnKg+consumption.dec*equivEnKg
            })
        }
        )
        /* console.log("this.graphConsumption: ", this.graphConsumption) */
        this.residuesItemCompany = this.residuesItem.filter((residueItem:any) => this.residuesItemCompanyTemp.includes(residueItem.chapterItemId))
        //this.energiesItemCompany = this.energies.filter((energyItem:any) => this.energiesItemCompanyTemp.includes(energyItem[0]))
        this.chartEnergyGenerate()
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  private loadgraphDataEnergy(companyId: string): void {
    let errorResponse: any
    let equivEnKg: number = 1
    let prevDelegation: string = ""
    let prevEnergy: string = ""
    let currentDelegation: string
    let currentEnergy: string
    let dataToView: number[] = [0,0,0,0,0,0,0,0]

    this.consumptionService.getEnergyByCompanyId(companyId)
    .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        console.log (this.consumptions)

        this.consumptions.forEach((consumption: any) =>
        {
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          console.log (prevDelegation,currentDelegation,prevEnergy,currentEnergy)
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy)) {
            dataToView[(consumption.year-2019)] = consumption.totalYear
            console.log ("dataToView: ", dataToView)
          } 
          else {
            this.myDatasets.push (
              {
              label: prevDelegation+" "+prevEnergy,
              data: dataToView,
              backgroundColor: this.primaryColors[this.startPrimaryColor--],
              stack: prevDelegation,
              },
            )
            dataToView = [0,0,0,0,0,0,0,0]
            dataToView[(consumption.year-2019)] = consumption.totalYear
            console.log("dataToView-> ", dataToView)
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName

          /*La ENERGÍA (aspecto 1) la convierto a kWh */
          this.energies.forEach((energy:EnergyDTO) => {
            if (energy.energyId === consumption.energy) {
                equivEnKg = energy.pci * energy.convLKg
            }
          })
        })

        this.startPrimaryColor  = 19
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: {
          labels: ["2019","2020","2021","2022","2023","2024"],
          datasets: this.myDatasets},
          options: {
            plugins: {
              title: {
                  display: true,
                  text: this.aspectEnergy          
                },
            },
            responsive: true,
            interaction: {
              intersect: true,
            },
            scales: {
              x: {
              
              },
              y: {
      
              }
            }
          }      
        })
            
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

  chartEnergyGenerate() {}

/*   chartEnergyGenerate() {
    this.graphDataTemp = []
    this.graphData = []
    this.myDatasets = []
    this.startPrimaryColor  = 19
    this.chart.destroy()

    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == '1')
    if (this.delegation.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    }
    if (this.yearEnergy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearEnergy.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    this.graphDataTemp.map((item:graphData) => {
      this.graphData.push({
        'delegation': item.delegation,
        'dataType': item.energyName,
        'year': item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec],
        'quarterlyData': [(item.jan + item.feb + item.mar),(item.apr + item.may + item.jun),(item.jul + item.aug + item.sep), (item.oct + item.nov + item.dec)],
        'yearlyData': item.jan+item.feb+item.mar+item.apr+item.may+item.jun+item.jul+item.aug+item.sep+item.oct+item.nov+item.dec
      })
    })
    let dataToView: number[] = []
    let legendFormatToView: string[]
    let stackFormatToView: string
    let prevYear: string = ""
    let prevDelegation: string = ""
    let prevEnergy: string = ""
    let currentYear: string
    let currentDelegation: string
    let currentEnergy: string

    this.graphData.map(item => {
      currentYear = item.year
      currentDelegation = item.delegation
      currentEnergy = item.dataType

      if (this.isYearViewE) {
        if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy)) {
          dataToView.push(item.yearlyData)
          prevYear = currentYear
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
        } else {
          dataToView = []
        }
        legendFormatToView = this.graphQuarters
        stackFormatToView = item.year
        this.myDatasets.push(
        {
        label: item.delegation+" "+item.dataType,
        data: dataToView,
        backgroundColor: this.primaryColors[this.startPrimaryColor--],
        stack: item.delegation,
        },
        )
      }

      if (this.isQuarterlyViewE) {
        dataToView = item.quarterlyData
        legendFormatToView = this.graphQuarters
        stackFormatToView = "Q1, Q2, Q3, Q4"
      }
      if (this.isMonthlyViewE) {
        dataToView = item.monthlyData
        legendFormatToView = this.graphMonths
        stackFormatToView = item.dataType
      }
    })

    this.startPrimaryColor  = 19
    this.chart = new Chart("energyGraph", {
      type: 'bar',
      data: {
         labels: ["2019","2020","2021","2022","2023","2024"],
         datasets: [
          {
            "label": "Can Valero Biomasa",
            "data": [707.94,707.94,707.94,707.94,707.94,0],
            "backgroundColor": "#365446",
            "stack": "Can Valero"
          },
          {
            "label": "Can Valero Electricidad",
            "data": [210, 210, 210, 210, 210, 0],
            "backgroundColor": "#1A237E",
            "stack": "Can Valero"
          },
          {
            "label": "Can Valero Fuel",
            "data": [2334,2334,2334,2334,2334,0],
            "backgroundColor": "#d62828",
            "stack": "Can Valero"
          },
          {
            "label": "Son Bugadelles Biomasa",
            "data": [707.94,707.94,707.94,707.94,707.94,0],
            "backgroundColor": "#365446",
            "stack": "Son Bugadelles"
          },
          {
            "label": "Son Bugadelles Electricidad",
            "data": [210, 210, 210, 210, 210, 0],
            "backgroundColor": "#1A237E",
            "stack": "Son Bugadelles"
          },
          {
            "label": "Son Castelló Fuel",
            "data": [2334,2334,2334,2334,2334,0],
            "backgroundColor": "#d62828",
            "stack": "Son Castelló"
          },
          {
            "label": "Son Castelló Biomasa",
            "data": [707.94,707.94,707.94,707.94,707.94,0],
            "backgroundColor": "#365446",
            "stack": "Son Castelló"
          },
          {
            "label": "Son Castelló Electricidad",
            "data": [210, 210, 210, 210, 210,0],
            "backgroundColor": "#1A237E",
            "stack": "Son Castelló"
          },
          {
            "label": "Son Castelló Fuel",
            "data": [2334,2334,2334,2334,2334,0],
            "backgroundColor": "#d62828",
            "stack": "Son Castelló"
          },
        ]
      },
      options: {
        plugins: {
          title: {
              display: true,
              text: this.aspectEnergy          
            },
        },
        responsive: true,
        interaction: {
          intersect: true,
        },
        scales: {
          x: {
          
          },
          y: {
  
          }
        }
      }      
    })

  } */

  chartResidueGenerate() {
    this.graphDataTemp = []
    this.graphData = []
    this.startPrimaryColor  = 19
    this.chart.destroy()

    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == '3')
    if (this.delegation.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    }
    if (this.yearEnergy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearEnergy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }

    this.graphDataTemp.map((item:graphData) => {
      this.residues.map( residueItem => {
        residueItem.chapters.map( (subItem:any)=> {
          subItem.chapterItems.forEach( (chapterItem: ChapterItem)=> {
            if(chapterItem.chapterItemId === item.residueName) {
              this.theDataType = chapterItem.chapterItemName
            }
          })
        })
      })
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

    this.startPrimaryColor  = 19

    this.chart = new Chart("residueGraph", {
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
  chartRatioBilling() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.isRatioCNAEE = false
    this.chartObjective()
    return;
    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == '1')
    this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearEnergy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearEnergy.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }
    console.log("Ratio billing: ", this.graphDataTemp)
    this.graphDataTemp.map((item:graphData) => {
      let aspectHardCoded = '1'
      switch ( aspectHardCoded ) {
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
  chartYearlyViewE(){ 
    if (this.chart) {
      this.chart.destroy()
    }
    this.isQuarterlyViewE = false
    this.isMonthlyViewE = false
  }
  chartQuarterlyViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.isYearViewE = false
    this.isMonthlyViewE = false
  }
  chartmonthlyViewE() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.isYearViewE = false
    this.isQuarterlyViewE = false
  }

  chartRatioCNAE() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.isRatioBillingE = false
    this.chartObjective()
    return
    this.graphDataTemp = this.graphConsumption.filter((item:any) => item.aspectId == '1')
    this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.yearEnergy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.year == this.yearEnergy.value)
    }
    if (this.energy.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.energy.value)
    }
    if (this.residue.value) {
      this.graphDataTemp = this.graphDataTemp.filter((item:any) => item.energyName == this.residue.value)
    }
    console.log("Ratio CNAE ", this.graphDataTemp)
    this.graphDataTemp.map((item:graphData) => {
        let aspectHardCoded = '1'
        switch ( aspectHardCoded ) {
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
    this.graphObjectiveTemp = this.objectives.filter((item:any) => item.aspectId == '1')
    this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.delegation == this.delegation.value)
    if (this.isRatioBillingE) {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any)=> item.theRatioRype = "Billing")
      theLabel = "Billing objective"
    } else {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.theRatioRype != 'Billing')
      theLabel = "CNAE objective"
    }
    if (this.yearEnergy.value) {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.year == this.yearEnergy.value)
    }

    console.log ("Los objetivos ", this.graphObjectiveTemp, this.isRatioBillingE, this.isRatioCNAEE)

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

  changSelectOption (e: any) {
    this.chart.destroy()
    this.myDatasets = []
  }

  selectionEnergyResidueChange(e: any) {
    this.chart.destroy()
    this.myDatasets = []
  }

  graphFormReset() {
    this.delegation.reset()
    this.yearEnergy.reset()
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
