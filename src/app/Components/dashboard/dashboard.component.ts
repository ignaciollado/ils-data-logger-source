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
  quarterlyViewGraphE: UntypedFormControl
  monthlyViewGraphE: UntypedFormControl
  kWView: UntypedFormControl
  MWView: UntypedFormControl
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
  billingProductions!: BillingDTO[]
  cnaeProducctions!: CnaeDataDTO[]
  aspectConsumptions!: ConsumptionDTO[]
  residuesItem: ChapterItem[] = []
  residuesItemCompany: ChapterItem[] = []
  residuesItemCompanyTemp: string[] = []

  graphDataTemp: graphData[] = []
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
  }, 
  options: {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: '#365446',
        }
      }
    }
  },
})

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
  isQuarterViewE : boolean = false
  isMonthViewE : boolean = false
  iskWViewE : boolean = true
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
    this.graphMonths = ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12','2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06', '2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12','2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06', '2021-07', '2021-08', '2021-09', '2021-10', '2021-11', '2021-12','2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12','2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12','2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']
    this.graphQuarters = ['2019-T1','2019-T2','2019-T3','2019-T4','2020-T1','2020-T2','2020-T3','2020-T4','2021-T1','2021-T2','2021-T3','2021-T4','2022-T1','2022-T2','2022-T3','2022-T4','2023-T1','2023-T2','2023-T3','2023-T4','2024-T1','2024-T2','2024-T3','2024-T4']
    this.graphYears = ['2019', '2020', '2021', '2022', '2023', '2024']

    if (localStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (kWh)"
      this.aspectWater = "Aigua (L)"
      this.aspectResidue = "Residu (kg)"
      this.aspectEmissions = "Emissions (CO2e en T)"
    } else if (localStorage.getItem('preferredLang') === 'cas') {
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Agua (L)"
      this.aspectResidue = "Residuo (kg)"
      this.aspectEmissions = "Emisiones (CO2e en T)"
    }

    this.delegation = new UntypedFormControl('')
    this.yearEnergy = new UntypedFormControl('')
    this.ratioBillingGraphE = new UntypedFormControl()
    this.ratioCNAEgGraphE = new UntypedFormControl()
    this.quarterlyViewGraphE = new UntypedFormControl()
    this.yearWiewGraphE = new UntypedFormControl()
    this.monthlyViewGraphE = new UntypedFormControl()
    this.kWView = new UntypedFormControl()
    this.MWView = new UntypedFormControl()
    this.energy = new UntypedFormControl('')
    this.residue = new UntypedFormControl('')

    this.energyGraphForm = this.formBuilder.group({
      delegation: this.delegation,
      yearEnergy: this.yearEnergy,
      ratioBillingGraphE: this.ratioBillingGraphE,
      ratioCNAEgGraphE: this.ratioCNAEgGraphE,
      kWView: this.kWView,
      MWView: this.MWView,
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
    this.loadObjectives(this.companyId)
    this.loadProductionCNAE(this.companyId)
    this.loadgraphDataEnergy()
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

  loadgraphDataEnergy(): void {
    let errorResponse: any
    let equivEnkWh: number = 1
    let convertkWhToMWh = 1
    let prevDelegation: string = ""
    let prevEnergy: string = ""
    let prevYear: string = ""
    let currentDelegation: string
    let currentEnergy: string
    let currentYear: string
    let dataToMonthlyView: number[] = [] /* los meses de seis años */
    let dataToQuarterView: number[] = [] /* los trimestres de seis años */
    let dataToYearView: number[] = [] /* seis años del 2019 al 2024 */
    for (var _i = 0; _i < 72; _i++) {
      if (_i<6) {dataToYearView.push(0)}
      if (_i<24) {dataToQuarterView.push(0)}
      dataToMonthlyView.push(0)
    }
    this.myDatasets = []
    this.chart.destroy()
    this.startPrimaryColor = 19

    if (this.isMWViewE) {
      convertkWhToMWh = 1000
    } else {
      convertkWhToMWh = 1
    }

    if (this.isYearViewE) {
      this.consumptionService.getYearlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) =>
        {
          /*La ENERGÍA la convierto a kWh */
          this.energies.forEach((energy:EnergyDTO) => {
            if (energy.nameES == consumption.energyName) {
              equivEnkWh = energy.pci * energy.convLKg
            }
          })
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          currentYear = consumption.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy)) {
            dataToYearView[(consumption.year-2019)] = consumption.totalYear * (equivEnkWh/convertkWhToMWh)
          }
          else {
            if (this.isRatioBillingE) {
              this.billingYearProduction(dataToYearView, prevDelegation)
              this.delegation.disable()
              this.energy.disable()
            } else {
              this.delegation.enable()
              this.energy.enable()
            }
            this.myDatasets.push (
            {
            label: prevDelegation+" "+prevEnergy,
            data: dataToYearView,
            backgroundColor: this.primaryColors[this.startPrimaryColor--],
            stack: prevDelegation,
            },
            )
            dataToYearView = [0,0,0,0,0,0]
            dataToYearView[(consumption.year-2019)] = consumption.totalYear * (equivEnkWh/convertkWhToMWh)
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          prevYear = currentYear
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          currentYear = consumption.year
        })
        if (this.isRatioBillingE) {
        this.billingYearProduction(dataToYearView, prevDelegation)
        this.delegation.disable()
        this.energy.disable()
        } else {
        this.delegation.enable()
        this.energy.enable()
        }
        this.myDatasets.push (
        {
        label: prevDelegation+" "+prevEnergy,
        data: dataToYearView,
        backgroundColor: this.primaryColors[this.startPrimaryColor--],
        stack: prevDelegation,
        },
        )

        if(this.delegation.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: 
          {
          labels: this.graphYears,
          datasets: this.myDatasets
          },
          options:
          {
            plugins: {
              legend: {display: true, position: 'bottom', labels: { color: '#365446'}},
              title: { display: true, text: this.aspectEnergy},
            },
            responsive: true,
            interaction: {
              intersect: true,
            },
          }
        })

        },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
      )
    }

    if (this.isQuarterViewE) {
      this.consumptionService.getQuarterlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        console.log ("this.consumptions ", this.consumptions, this.companyId)
        this.consumptions.forEach((consumption: any) =>
        {
          /*La ENERGÍA la convierto a kWh */
          this.energies.forEach((energy:EnergyDTO) => {
            if (energy.nameES == consumption.energyName) {
              equivEnkWh = energy.pci * energy.convLKg
            }
          })
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy)) {
              if(consumption.year == "2019"){
                dataToQuarterView[0] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[1] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[2] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[3] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2020"){
                dataToQuarterView[4] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[5] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[6] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[7] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2021"){
                dataToQuarterView[8] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[9] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[10] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[11] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2022"){
                dataToQuarterView[12] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[13] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[14] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[15] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2023"){
                dataToQuarterView[16] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[17] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[18] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[19] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2024"){
                dataToQuarterView[20] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[21] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[22] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[23] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2025"){
                dataToQuarterView[24] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[25] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[26] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[27] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
          }
          else {
            if (this.isRatioBillingE) {
              this.billingQuarterProduction(dataToQuarterView, prevDelegation)
              this.delegation.disable()
              this.energy.disable()
            } else {
              this.delegation.enable()
              this.energy.enable()
            }
            this.myDatasets.push (
              {
              label: prevDelegation+" "+prevEnergy,
              data: dataToQuarterView,
              backgroundColor: this.primaryColors[this.startPrimaryColor--],
              stack: prevDelegation,
              },
            )
            dataToQuarterView = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              if(consumption.year == "2019"){
                dataToQuarterView[0] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[1] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[2] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[3] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2020"){
                dataToQuarterView[4] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[5] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[6] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[7] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2021"){
                dataToQuarterView[8] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[9] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[10] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[11] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2022"){
                dataToQuarterView[12] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[13] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[14] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[15] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2023"){
                dataToQuarterView[16] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[17] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[18] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[19] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2024"){
                dataToQuarterView[20] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[21] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[22] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[23] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2025"){
                dataToQuarterView[24] = consumption.Q1 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[25] = consumption.Q2 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[26] = consumption.Q3 * equivEnkWh/convertkWhToMWh
                dataToQuarterView[27] = consumption.Q4 * equivEnkWh/convertkWhToMWh
              }
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
        })
        if (this.isRatioBillingE) {
          this.billingQuarterProduction(dataToQuarterView, prevDelegation)
          this.delegation.disable()
          this.energy.disable()
        } else {
          this.delegation.enable()
          this.energy.enable()
        }
        this.myDatasets.push (
          {
          label: prevDelegation+" "+prevEnergy,
          data: dataToQuarterView,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          stack: prevDelegation,
          },
        )
        if(this.yearEnergy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.yearEnergy.value)
        }
        if(this.delegation.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: {
          labels: this.graphQuarters,
          datasets: this.myDatasets},
          options:
          {
            events: ['click'],
            plugins: {
              legend: {display: true, position: 'bottom', labels: { color: '#365446'}},
              title: { display: true, text: this.aspectEnergy},
            },
            responsive: true,
            interaction: {
              intersect: true,
            },
          }
        })

        },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
      )
    }

    if (this.isMonthViewE) {
      this.consumptionService.getMonthlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) =>
        {
          /*La ENERGÍA la convierto a kWh */
          this.energies.forEach((energy:EnergyDTO) => {
            if (energy.nameES == consumption.energyName) {
              equivEnkWh = energy.pci * energy.convLKg
            }
          })
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          prevYear = consumption.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy) && (prevYear == "" || prevYear == currentYear)) {
              if(consumption.year == "2019"){
                dataToMonthlyView[0] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[1] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[2] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[3] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[4] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[5] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[6] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[7] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[8] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[9] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[10] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[11] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2020"){
                dataToMonthlyView[12] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[13] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[14] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[15] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[16] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[17] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[18] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[19] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[20] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[21] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[22] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[23] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2021"){
                dataToMonthlyView[24] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[25] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[26] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[27] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[28] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[29] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[30] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[31] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[32] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[33] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[34] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[35] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2022"){
                dataToMonthlyView[36] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[37] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[38] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[39] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[40] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[41] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[42] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[43] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[44] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[45] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[46] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[47] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2023"){
                dataToMonthlyView[48] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[49] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[50] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[51] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[52] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[53] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[54] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[55] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[56] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[57] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[58] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[59] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2024"){
                dataToMonthlyView[60] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[61] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[62] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[63] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[64] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[65] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[66] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[67] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[68] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[69] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[70] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[71] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
          }
          else {
            this.myDatasets.push (
              {
              label: prevDelegation+" "+prevEnergy,
              data: dataToMonthlyView,
              backgroundColor: this.primaryColors[this.startPrimaryColor--],
              stack: prevDelegation,
              },
            )
            dataToMonthlyView = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              if(consumption.year == "2019"){
                dataToMonthlyView[0] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[1] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[2] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[3] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[4] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[5] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[6] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[7] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[8] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[9] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[10] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[11] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2020"){
                dataToMonthlyView[12] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[13] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[14] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[15] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[16] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[17] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[18] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[19] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[20] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[21] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[22] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[23] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2021"){
                dataToMonthlyView[24] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[25] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[26] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[27] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[28] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[29] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[30] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[31] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[32] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[33] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[34] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[35] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2022"){
                dataToMonthlyView[36] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[37] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[38] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[39] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[40] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[41] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[42] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[43] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[44] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[45] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[46] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[47] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2023"){
                dataToMonthlyView[48] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[49] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[50] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[51] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[52] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[53] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[54] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[55] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[56] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[57] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[58] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[59] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
              if(consumption.year == "2024"){
                dataToMonthlyView[60] = consumption.jan * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[61] = consumption.feb * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[62] = consumption.mar * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[63] = consumption.apr * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[64] = consumption.may * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[65] = consumption.jun * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[66] = consumption.jul * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[67] = consumption.aug * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[68] = consumption.sep * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[69] = consumption.oct * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[70] = consumption.nov * equivEnkWh/convertkWhToMWh
                dataToMonthlyView[71] = consumption.dec * equivEnkWh/convertkWhToMWh
              }
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          prevYear = currentYear
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          prevYear = consumption.year
        })
        this.myDatasets.push (
          {
          label: prevDelegation+" "+prevEnergy,
          data: dataToMonthlyView,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          stack: prevDelegation,
          },
        )
        if(this.delegation.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: {
          labels: this.graphMonths,
          datasets: this.myDatasets},
          options:
          {
            events: ['click'],
            plugins: {
              legend: {display: true, position: 'bottom', labels: { color: '#365446'}},
              title: { display: true, text: this.aspectEnergy},
            },
            responsive: true,
            interaction: {
              intersect: true,
            },
          }
        })

        },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
      )
    }
    this.chartObjective(1)
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

  private loadProductionCNAE(companyId: string): void {
    let errorResponse: any;
    this.cnaesDataService.getCnaesDataByCompany(companyId)
    .subscribe(
      (cnaes: CnaeDataDTO[]) => {
        this.cnaeProducctions = cnaes
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  chartResidueGenerate(){
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

  billingYearProduction(dataToYearView:number[], delegationProduction: string): void {
    let currentDelegation: string
    let currentYear: string
    let prevDelegation: string = ""
    let prevYear: string = ""
    let billingProductionYearly: number[] = [0,0,0,0,0,0] /* seis años del 2019 al 2024 */
    let ratiobillingProductionYearly: number[] = [0,0,0,0,0,0]

    this.billingService.getYearBillingByCompanyId(this.companyId, delegationProduction)
      .subscribe((yearBillingProduction: BillingDTO[]) => {
        this.billingProductions = yearBillingProduction
        this.billingProductions.forEach((billingProduction: any) =>
        {
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation)) {
            billingProductionYearly[(billingProduction.year-2019)] = billingProduction.totalYear
          }
          else {
            billingProductionYearly = [0,0,0,0,0,0]
            billingProductionYearly[(billingProduction.year-2019)] = billingProduction.totalYear
          }
          prevDelegation = currentDelegation
          prevYear = currentYear
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
        })
        ratiobillingProductionYearly = [
          +dataToYearView[0]/+billingProductionYearly[0],
          +dataToYearView[1]/+billingProductionYearly[1],
          +dataToYearView[2]/+billingProductionYearly[2],
          +dataToYearView[3]/+billingProductionYearly[3],
          +dataToYearView[4]/+billingProductionYearly[4],
          +dataToYearView[5]/+billingProductionYearly[5]
        ]
        this.myDatasets.push (
        {
        type: 'line',
        label: "Ratio "+prevDelegation,
        data: ratiobillingProductionYearly,
        backgroundColor: this.primaryColors[this.startPrimaryColor--],
        borderColor: this.primaryColors[this.startPrimaryColor--],
        borderWidth: 1,
        stack: prevDelegation,
        },
        )
        if(this.delegation.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart.update();
      }
      )
  }

  billingQuarterProduction(dataToQuarterView:number[], delegationProduction: string): void {
    let currentDelegation: string
    let currentYear: string
    let prevDelegation: string = ""
    let prevYear: string = ""
    let billingProductionQuarterly: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] /* los trimestres de seis años */
    let ratiobillingProductionQuarterly: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] /* los trimestres de seis años */

    this.billingService.getQuarterBillingByCompanyId(this.companyId, delegationProduction)
      .subscribe((quearterBillingProduction: BillingDTO[]) => {
        this.billingProductions = quearterBillingProduction
        console.log("this.billingProductions", this.billingProductions)
        this.billingProductions.forEach((billingProduction: any) =>
        {
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation)) {
            if(billingProduction.year == "2019"){
              dataToQuarterView[0] = billingProduction.Q1
              dataToQuarterView[1] = billingProduction.Q2
              dataToQuarterView[2] = billingProduction.Q3
              dataToQuarterView[3] = billingProduction.Q4
            }
            if(billingProduction.year == "2020"){
              dataToQuarterView[4] = billingProduction.Q1
              dataToQuarterView[5] = billingProduction.Q2
              dataToQuarterView[6] = billingProduction.Q3
              dataToQuarterView[7] = billingProduction.Q4
            }
            if(billingProduction.year == "2021"){
              dataToQuarterView[8] = billingProduction.Q1
              dataToQuarterView[9] = billingProduction.Q2
              dataToQuarterView[10] = billingProduction.Q3
              dataToQuarterView[11] = billingProduction.Q4
            }
            if(billingProduction.year == "2022"){
              dataToQuarterView[12] = billingProduction.Q1
              dataToQuarterView[13] = billingProduction.Q2
              dataToQuarterView[14] = billingProduction.Q3
              dataToQuarterView[15] = billingProduction.Q4
            }
            if(billingProduction.year == "2023"){
              dataToQuarterView[16] = billingProduction.Q1
              dataToQuarterView[17] = billingProduction.Q2
              dataToQuarterView[18] = billingProduction.Q3
              dataToQuarterView[19] = billingProduction.Q4
            }
            if(billingProduction.year == "2024"){
              dataToQuarterView[20] = billingProduction.Q1
              dataToQuarterView[21] = billingProduction.Q2
              dataToQuarterView[22] = billingProduction.Q3
              dataToQuarterView[23] = billingProduction.Q4
            }
            if(billingProduction.year == "2025"){
              dataToQuarterView[24] = billingProduction.Q1
              dataToQuarterView[25] = billingProduction.Q2
              dataToQuarterView[26] = billingProduction.Q3
              dataToQuarterView[27] = billingProduction.Q4
            }
          }
          else {
            dataToQuarterView = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            if(billingProduction.year == "2019"){
              dataToQuarterView[0] = billingProduction.Q1
              dataToQuarterView[1] = billingProduction.Q2
              dataToQuarterView[2] = billingProduction.Q3
              dataToQuarterView[3] = billingProduction.Q4
            }
            if(billingProduction.year == "2020"){
              dataToQuarterView[4] = billingProduction.Q1
              dataToQuarterView[5] = billingProduction.Q2
              dataToQuarterView[6] = billingProduction.Q3
              dataToQuarterView[7] = billingProduction.Q4
            }
            if(billingProduction.year == "2021"){
              dataToQuarterView[8] = billingProduction.Q1
              dataToQuarterView[9] = billingProduction.Q2
              dataToQuarterView[10] = billingProduction.Q3
              dataToQuarterView[11] = billingProduction.Q4
            }
            if(billingProduction.year == "2022"){
              dataToQuarterView[12] = billingProduction.Q1
              dataToQuarterView[13] = billingProduction.Q2
              dataToQuarterView[14] = billingProduction.Q3
              dataToQuarterView[15] = billingProduction.Q4
            }
            if(billingProduction.year == "2023"){
              dataToQuarterView[16] = billingProduction.Q1
              dataToQuarterView[17] = billingProduction.Q2
              dataToQuarterView[18] = billingProduction.Q3
              dataToQuarterView[19] = billingProduction.Q4
            }
            if(billingProduction.year == "2024"){
              dataToQuarterView[20] = billingProduction.Q1
              dataToQuarterView[21] = billingProduction.Q2
              dataToQuarterView[22] = billingProduction.Q3
              dataToQuarterView[23] = billingProduction.Q4
            }
            if(billingProduction.year == "2025"){
              dataToQuarterView[24] = billingProduction.Q1
              dataToQuarterView[25] = billingProduction.Q2
              dataToQuarterView[26] = billingProduction.Q3
              dataToQuarterView[27] = billingProduction.Q4
            }
          }
          prevDelegation = currentDelegation
          prevYear = currentYear
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
        })
        ratiobillingProductionQuarterly = [
          +dataToQuarterView[0]/+billingProductionQuarterly[0],
          +dataToQuarterView[1]/+billingProductionQuarterly[1],
          +dataToQuarterView[2]/+billingProductionQuarterly[2],
          +dataToQuarterView[3]/+billingProductionQuarterly[3],
          +dataToQuarterView[4]/+billingProductionQuarterly[4],
          +dataToQuarterView[5]/+billingProductionQuarterly[5],
          +dataToQuarterView[6]/+billingProductionQuarterly[6],
          +dataToQuarterView[7]/+billingProductionQuarterly[7],
          +dataToQuarterView[8]/+billingProductionQuarterly[8],
          +dataToQuarterView[9]/+billingProductionQuarterly[9],
          +dataToQuarterView[10]/+billingProductionQuarterly[10],
          +dataToQuarterView[11]/+billingProductionQuarterly[11],
          +dataToQuarterView[12]/+billingProductionQuarterly[12],
          +dataToQuarterView[13]/+billingProductionQuarterly[13],
          +dataToQuarterView[14]/+billingProductionQuarterly[14],
          +dataToQuarterView[15]/+billingProductionQuarterly[15],
          +dataToQuarterView[16]/+billingProductionQuarterly[16],
          +dataToQuarterView[17]/+billingProductionQuarterly[17],
          +dataToQuarterView[18]/+billingProductionQuarterly[18],
          +dataToQuarterView[19]/+billingProductionQuarterly[19],
          +dataToQuarterView[20]/+billingProductionQuarterly[20],
          +dataToQuarterView[21]/+billingProductionQuarterly[21],
          +dataToQuarterView[22]/+billingProductionQuarterly[22],
          +dataToQuarterView[23]/+billingProductionQuarterly[23]

        ]
        console.log("ratiobillingProductionQuarterly", ratiobillingProductionQuarterly, "dataToQuarterView", dataToQuarterView, "billingProductionQuarterly", billingProductionQuarterly)
        this.myDatasets.push (
        {
        type: 'line',
        label: "Ratio "+prevDelegation,
        data: ratiobillingProductionQuarterly,
        backgroundColor: this.primaryColors[this.startPrimaryColor--],
        borderColor: this.primaryColors[this.startPrimaryColor--],
        borderWidth: 1,
        stack: prevDelegation,
        },
        )
        if(this.delegation.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.myDatasets = this.myDatasets.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart.update();
      }
      )
  }

  chartRatioCNAE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.chartObjective(1)
    this.loadgraphDataEnergy()
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

  chartYearlyViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.isQuarterViewE = !this.isYearViewE
    this.isMonthViewE = false
    this.loadgraphDataEnergy()
  }

  chartQuarterlyViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.isMonthViewE = !this.isQuarterViewE
    this.isYearViewE = false
    this.loadgraphDataEnergy()
  }

  chartmonthlyViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.isYearViewE = !this.isMonthViewE
    this.isQuarterViewE = false
    this.loadgraphDataEnergy()
  }

  chartkWViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.isMWViewE = !this.iskWViewE
    if (localStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (kWh)"
    }
    else {
      this.aspectEnergy = "Energía (kWh)"
    }
    this.loadgraphDataEnergy()
  }

  chartMWViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    this.iskWViewE = !this.isMWViewE
    if (localStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (MWh)"
    }
    else {
      this.aspectEnergy = "Energía (MWh)"
    }
    this.loadgraphDataEnergy()
  }

  chartObjective(aspectId:number){
    this.startPrimaryColor  = 19
   /*  this.graphObjectiveTemp = this.objectives.filter((item:any) => item.aspectId == aspectId)
    if(this.delegation.value){
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.delegation == this.delegation.value)
    }
    if (this.energy.value) {
      this.graphObjectiveTemp = this.graphObjectiveTemp.filter((item:any) => item.year == this.energy.value)
    }

    this.graphObjectiveTemp.map((item:any) => {
      this.energies.forEach((energy)=>{
        if (energy.energyId == item.enviromentalDataName){
          this.theDataType = energy.nameES
        }
      })
      this.graphObjective.push({
        'delegation': item.delegation,
        'dataType': this.theDataType,
        'year': item.theRatioType+" "+item.year,
        'monthlyData': [item.jan, item.feb, item.mar, item.apr, item.may, item.jun, item.jul, item.aug, item.sep, item.oct, item.nov, item.dec]
      })
    })
    this.graphObjective.map(item=> {
      this.myDatasets.push(
        {
          type: 'line',
          label: "Objective: "+item.year+" "+item.delegation+" "+item.dataType,
          data: item.monthlyData,
          stack: item.year+" "+item.delegation,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          borderColor: '#000000',
          borderWidth: .5,
          fill: false,
        },
      )
    })
    this.chart.update() */
  }

  graphFormReset(){
    this.delegation.reset()
    this.energy.reset()
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
