import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { SharedService } from 'src/app/Services/shared.service'
import Chart from 'chart.js/auto'
import { JwtHelperService } from '@auth0/angular-jwt'
import { HeaderMenusService } from 'src/app/Services/header-menus.service'
import { HeaderMenus } from 'src/app/Models/header-menus.dto'

import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

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
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
})
export class EnergyGraphComponent implements OnInit {
  private companyId: string | null

  delegation: UntypedFormControl
  yearEnergy: UntypedFormControl
  ratioBillingGraphE: UntypedFormControl
  ratioCNAEgGraphE: UntypedFormControl
  yearWiewGraphE: UntypedFormControl
  quarterlyViewGraphE: UntypedFormControl
  monthlyViewGraphE: UntypedFormControl
  monthlyViewE = UntypedFormControl

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
  residuesItem: any[] = []
  residuesItemCompany: ChapterItem[] = []
  residuesItemCompanyTemp: string[] = []

  graphDataTemp: graphData[] = []
  graphData: graphData[] = []
  endergyDataSet: any[] = []

  graphObjectiveTemp: ObjectiveDTO[]
  graphObjective: any[] = []
  objectiveDataSets: any[] = []
  startPrimaryColor: number
  theDataType: string = ''
  theRatios: number[] = []
  graphConsumption: graphData[] = []
  startYear: number = 2019;
  currentYear: number = new Date().getFullYear();
  numberOfYears: number = this.currentYear - this.startYear + 1; // +1 para incluir el año inicial

  quantityMaterials: number = 0

  chart: any = new Chart("graph", {type: 'bar',
    data: { datasets: this.endergyDataSet }, 
    options: { responsive: true, scales: { x: { ticks: { color: '#365446' } } } },
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
  isSearching: boolean = false
  isEnergy: boolean = false
  isResidue: boolean = false

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

    // Generar meses en formato 'YYYY-MM'
    this.graphMonths = [];
    for (let year = this.startYear; year <= this.currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, '0');
          this.graphMonths.push(`${year}-${monthStr}`);
      }
    }

    // Generar trimestres en formato 'YYYY-Tn'
    this.graphQuarters = [];
    for (let year = this.startYear; year <= this.currentYear; year++) {
      for (let q = 1; q <= 4; q++) {
          this.graphQuarters.push(`${year}-T${q}`);
      }
    }

    // Generar años
    this.graphYears = Array.from({ length: this.numberOfYears }, (_, i) => (this.startYear + i).toString());

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
    this.ratioBillingGraphE = new UntypedFormControl(false)
    this.ratioCNAEgGraphE = new UntypedFormControl(false)
    this.yearWiewGraphE = new UntypedFormControl(true)
    this.quarterlyViewGraphE = new UntypedFormControl(false)
    this.monthlyViewGraphE = new UntypedFormControl(false)
    this.kWView = new UntypedFormControl(true)
    this.MWView = new UntypedFormControl(false)
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
      quarterlyViewGraphE: this.quarterlyViewGraphE,
      yearWiewGraphE: this.yearWiewGraphE,
      monthlyViewGraphE: this.monthlyViewGraphE,
      monthlyViewE: this.monthlyViewE 
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

/*   private loadResidues(): void {
    this.residueService.getResiduesLER()
    .subscribe(
      (residues: any[]) => {
        this.residues = residues
          this.residues.map( item => { 
          this.residuesItem = [...this.residuesItem, item]
        })
      },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
    )
  } */

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
   
    let equivEnkWh: number = 1
    let convertkWhToMWh = 1
    let prevDelegation: string = ""
    let prevEnergy: string = ""
    let prevYear: string = ""
    let currentDelegation: string
    let currentEnergy: string
    let currentYear: string
    let dataToMonthlyView: number[] = [] /* los meses de siete años */
    let dataToQuarterView: number[] = [] /* los trimestres de siete años */
    let dataToYearView: number[] = [] /* siete años del 2019 al 2025 */

    for (var _i = 0; _i < 84; _i++) {
      if (_i<6) {dataToYearView.push(0)}
      if (_i<24) {dataToQuarterView.push(0)}
      dataToMonthlyView.push(0)
    }

    this.endergyDataSet = []
    this.chart.destroy()
    this.startPrimaryColor = 19

    if (this.energyGraphForm.get('MWView').value) {
      convertkWhToMWh = 1000
    } else {
      convertkWhToMWh = 1
    }

    if (this.energyGraphForm.get('yearWiewGraphE').value) {  //visualización por años
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
            if (this.energyGraphForm.get('ratioBillingGraphE').value) {
              this.billingYearProduction(dataToYearView, prevDelegation)
              this.delegation.disable()
              this.energy.disable()
            } else {
              this.delegation.enable()
              this.energy.enable()
            }
            this.endergyDataSet.push (
            {
            label: prevDelegation+" "+prevEnergy,
            data: dataToYearView,
            backgroundColor: this.primaryColors[this.startPrimaryColor--],
            stack: prevDelegation,
            },
            )
            dataToYearView = Array(this.numberOfYears).fill(0);

            dataToYearView[(consumption.year-2019)] = consumption.totalYear * (equivEnkWh/convertkWhToMWh)
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          prevYear = currentYear
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          currentYear = consumption.year
        })
        if (this.energyGraphForm.get('ratioBillingGraphE').value) {
          this.billingYearProduction(dataToYearView, prevDelegation)
          this.delegation.disable()
          this.energy.disable()
        } else {
          this.delegation.enable()
          this.energy.enable()
        }
        this.endergyDataSet.push (
        {
        label: prevDelegation+" "+prevEnergy,
        data: dataToYearView,
        backgroundColor: this.primaryColors[this.startPrimaryColor--],
        stack: prevDelegation,
        },
        )

        if(this.delegation.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }

        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: 
          {
          labels: this.graphYears,
          datasets: this.endergyDataSet
          },
          options:
          {
            plugins: {
              legend: {display: true, position: 'bottom', labels: { color: '#365446'}},
              title: { display: true, text: this.aspectEnergy},
            },
            responsive: true,
            interaction: { intersect: true },
          }
        })

        },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
      )
    }

    if (this.energyGraphForm.get('quarterlyViewGraphE').value) { //visualización por trimestres
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
          // Inicializamos el array de trimestres si no lo está
          if (!dataToQuarterView || dataToQuarterView.length !== this.numberOfYears * 4) {
            dataToQuarterView = Array(this.numberOfYears * 4).fill(0);
          }
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy)) {
              const yearIndex = Number(consumption.year) - this.startYear;
              if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
                const baseIndex = yearIndex * 4;
                // Array de trimestres
                const quarters: (keyof typeof consumption)[] = ["Q1", "Q2", "Q3", "Q4"];
                for (let i = 0; i < 4; i++) {
                  dataToQuarterView[baseIndex + i] = consumption[quarters[i]] * equivEnkWh / convertkWhToMWh;
                }
              }             
          }
          else {
            if (this.energyGraphForm.get('ratioBillingGraphE').value) {
              this.billingQuarterProduction(dataToQuarterView, prevDelegation)
              this.delegation.disable()
              this.energy.disable()
            } else {
              this.delegation.enable()
              this.energy.enable()
            }
            this.endergyDataSet.push (
              {
              label: prevDelegation+" "+prevEnergy,
              data: dataToQuarterView,
              backgroundColor: this.primaryColors[this.startPrimaryColor--],
              stack: prevDelegation,
              },
            )
              this.numberOfYears = this.numberOfYears * 4 // trimestres
              dataToQuarterView = Array(this.numberOfYears).fill(0);
             // Calculamos el índice base para el año actual
              const yearIndex = Number(consumption.year) - this.startYear;
              if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
                const baseIndex = yearIndex * 4;
                // Array de los 4 trimestres
                const quarters: (keyof typeof consumption)[] = ["Q1", "Q2", "Q3", "Q4"];
                for (let i = 0; i < 4; i++) {
                  dataToQuarterView[baseIndex + i] = consumption[quarters[i]] * equivEnkWh / convertkWhToMWh;
                }
              }
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
        })
        /* if (this.isRatioBillingE) { */
        if (this.energyGraphForm.get('ratioBillingGraphE').value) {
          this.billingQuarterProduction(dataToQuarterView, prevDelegation)
          this.delegation.disable()
          this.energy.disable()
        } else {
          this.delegation.enable()
          this.energy.enable()
        }
        this.endergyDataSet.push (
          {
          label: prevDelegation+" "+prevEnergy,
          data: dataToQuarterView,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          stack: prevDelegation,
          },
        )
        if(this.yearEnergy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.yearEnergy.value)
        }
        if(this.delegation.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: {
          labels: this.graphQuarters,
          datasets: this.endergyDataSet},
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
        this.sharedService.showSnackBar(error.error);
      }
      )
    }

    if (this.energyGraphForm.get('monthlyViewGraphE').value) { //visualización por meses
      this.consumptionService.getMonthlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) =>
        {
          /* La ENERGÍA la convierto a kWh */
          this.energies.forEach((energy:EnergyDTO) => {
            if (energy.nameES == consumption.energyName) {
              equivEnkWh = energy.pci * energy.convLKg
            }
          })
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          prevYear = consumption.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation) && (prevEnergy == "" || prevEnergy == currentEnergy) && (prevYear == "" || prevYear == currentYear)) {
              const  yearIndex = Number(consumption.year) - this.startYear;
              if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
                const baseIndex = yearIndex * 12;
                dataToMonthlyView[baseIndex]     = consumption.jan * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 1] = consumption.feb * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 2] = consumption.mar * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 3] = consumption.apr * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 4] = consumption.may * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 5] = consumption.jun * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 6] = consumption.jul * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 7] = consumption.aug * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 8] = consumption.sep * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 9] = consumption.oct * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 10] = consumption.nov * equivEnkWh / convertkWhToMWh;
                dataToMonthlyView[baseIndex + 11] = consumption.dec * equivEnkWh / convertkWhToMWh;
              }             
          }
          else {
            this.endergyDataSet.push (
              {
              label: prevDelegation+" "+prevEnergy,
              data: dataToMonthlyView,
              backgroundColor: this.primaryColors[this.startPrimaryColor--],
              stack: prevDelegation,
              },
            )
            this.numberOfYears = this.numberOfYears * 12 // meses
            dataToMonthlyView = Array(this.numberOfYears).fill(0);
            const yearIndex = Number(consumption.year) - this.startYear;
            if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
                const baseIndex = yearIndex * 12;
                // Array con los nombres de los meses
                const months: (keyof typeof consumption)[] = [
                  "jan", "feb", "mar", "apr", "may", "jun",
                  "jul", "aug", "sep", "oct", "nov", "dec"
                ];
                // Llenamos dinámicamente los 12 meses
                for (let i = 0; i < 12; i++) {
                  dataToMonthlyView[baseIndex + i] = consumption[months[i]] * equivEnkWh / convertkWhToMWh;
                }
            }             
          }
          prevDelegation = currentDelegation
          prevEnergy = currentEnergy
          prevYear = currentYear
          currentDelegation = consumption.delegation
          currentEnergy = consumption.energyName
          prevYear = consumption.year
        })
        this.endergyDataSet.push (
          {
          label: prevDelegation+" "+prevEnergy,
          data: dataToMonthlyView,
          backgroundColor: this.primaryColors[this.startPrimaryColor--],
          stack: prevDelegation,
          },
        )
        if(this.delegation.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
        }
        this.chart = new Chart("energyGraph", {
          type: 'bar',
          data: {
          labels: this.graphMonths,
          datasets: this.endergyDataSet},
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
        this.sharedService.showSnackBar(error.error);
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
      this.endergyDataSet.push(
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
         datasets: this.endergyDataSet
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
    let billingProductionYearly: number[] = Array(this.numberOfYears).fill(0);
    let ratiobillingProductionYearly: number[] = Array(this.numberOfYears).fill(0);

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
            billingProductionYearly = Array(this.numberOfYears).fill(0);
            billingProductionYearly[(billingProduction.year-2019)] = billingProduction.totalYear
          }
          prevDelegation = currentDelegation
          prevYear = currentYear
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
        })
        ratiobillingProductionYearly = Array(this.numberOfYears).fill(0).map((_, i) => {
          // Evitamos divisiones por cero
          return billingProductionYearly[i] ? dataToYearView[i] / billingProductionYearly[i] : 0;
        });
        this.endergyDataSet.push (
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
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
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
    this.numberOfYears = this.numberOfYears * 4 // trimestres
    let billingProductionQuarterly: number[] = Array(this.numberOfYears).fill(0);
    this.numberOfYears = this.numberOfYears * 4 // trimestres
    let ratiobillingProductionQuarterly: number[] = Array(this.numberOfYears).fill(0);
    this.billingService.getQuarterBillingByCompanyId(this.companyId, delegationProduction)
      .subscribe((quearterBillingProduction: BillingDTO[]) => {
        this.billingProductions = quearterBillingProduction
        console.log("this.billingProductions", this.billingProductions)
        this.billingProductions.forEach((billingProduction: any) =>
        {
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
          if ((prevDelegation == "" || prevDelegation == currentDelegation)) {
            const yearIndex = Number(billingProduction.year) - this.startYear; // índice relativo al startYear
            if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
              const baseIndex = yearIndex * 4; // posición inicial para el año en el array
              dataToQuarterView[baseIndex]     = billingProduction.Q1;
              dataToQuarterView[baseIndex + 1] = billingProduction.Q2;
              dataToQuarterView[baseIndex + 2] = billingProduction.Q3;
              dataToQuarterView[baseIndex + 3] = billingProduction.Q4;
            }

          }
          else {
            this.numberOfYears = this.numberOfYears * 4 // trimestres
            dataToQuarterView = Array(this.numberOfYears).fill(0);
            const yearIndex = Number(billingProduction.year) - this.startYear;
            if (yearIndex >= 0 && yearIndex < this.numberOfYears) {
              const baseIndex = yearIndex * 4;
              dataToQuarterView[baseIndex]     = billingProduction.Q1;
              dataToQuarterView[baseIndex + 1] = billingProduction.Q2;
              dataToQuarterView[baseIndex + 2] = billingProduction.Q3;
              dataToQuarterView[baseIndex + 3] = billingProduction.Q4;
            }
          }
          prevDelegation = currentDelegation
          prevYear = currentYear
          currentDelegation = billingProduction.delegation
          currentYear = billingProduction.year
        })
        ratiobillingProductionQuarterly = [
          +dataToQuarterView[0]/+billingProductionQuarterly[0], //2019
          +dataToQuarterView[1]/+billingProductionQuarterly[1], //2019
          +dataToQuarterView[2]/+billingProductionQuarterly[2], //2019
          +dataToQuarterView[3]/+billingProductionQuarterly[3], //2019
          +dataToQuarterView[4]/+billingProductionQuarterly[4], //2020
          +dataToQuarterView[5]/+billingProductionQuarterly[5], //2020
          +dataToQuarterView[6]/+billingProductionQuarterly[6], //2020
          +dataToQuarterView[7]/+billingProductionQuarterly[7], //2020
          +dataToQuarterView[8]/+billingProductionQuarterly[8], //2021
          +dataToQuarterView[9]/+billingProductionQuarterly[9], //2021
          +dataToQuarterView[10]/+billingProductionQuarterly[10], //2021
          +dataToQuarterView[11]/+billingProductionQuarterly[11], //2021
          +dataToQuarterView[12]/+billingProductionQuarterly[12], //2022
          +dataToQuarterView[13]/+billingProductionQuarterly[13], //2022
          +dataToQuarterView[14]/+billingProductionQuarterly[14], //2022
          +dataToQuarterView[15]/+billingProductionQuarterly[15], //2022
          +dataToQuarterView[16]/+billingProductionQuarterly[16], //2023
          +dataToQuarterView[17]/+billingProductionQuarterly[17], //2023
          +dataToQuarterView[18]/+billingProductionQuarterly[18], //2023
          +dataToQuarterView[19]/+billingProductionQuarterly[19], //2023
          +dataToQuarterView[20]/+billingProductionQuarterly[20], //2024
          +dataToQuarterView[21]/+billingProductionQuarterly[21], //2024
          +dataToQuarterView[22]/+billingProductionQuarterly[22], //2024
          +dataToQuarterView[23]/+billingProductionQuarterly[23], //2024
          +dataToQuarterView[24]/+billingProductionQuarterly[24], //2025
          +dataToQuarterView[25]/+billingProductionQuarterly[25], //2025
          +dataToQuarterView[26]/+billingProductionQuarterly[26], //2025
          +dataToQuarterView[27]/+billingProductionQuarterly[27], //2025
        ]
        console.log("ratiobillingProductionQuarterly", ratiobillingProductionQuarterly, "dataToQuarterView", dataToQuarterView, "billingProductionQuarterly", billingProductionQuarterly)
        this.endergyDataSet.push (
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
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.stack == this.delegation.value)
        }
        if(this.energy.value) {
          this.endergyDataSet = this.endergyDataSet.filter((item:any)=>item.label.slice(-this.energy.value.length) == this.energy.value)
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
        this.endergyDataSet.push(
            {
            label: item.year+" "+item.dataType,
            data: item.monthlyData,
            backgroundColor: this.primaryColors[this.startPrimaryColor--],
            stack: item.dataType,
            borderWidth: 0
            },
        )
      })

    this.endergyDataSet.push(
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
         datasets: this.endergyDataSet
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
    /*     this.isQuarterViewE = !this.isYearViewE
    this.isMonthViewE = false */
    this.energyGraphForm.get('quarterlyViewGraphE').setValue(!this.energyGraphForm.get('yearWiewGraphE').value)
    this.energyGraphForm.get('monthlyViewGraphE').setValue(false)
    this.loadgraphDataEnergy()
  }

  chartQuarterlyViewE(){
    if (this.chart) {
      this.chart.destroy()
    }
    /*     this.isMonthViewE = !this.isQuarterViewE
    this.isYearViewE = false */
    this.energyGraphForm.get('monthlyViewGraphE').setValue(!this.energyGraphForm.get('quarterlyViewGraphE').value)
    this.energyGraphForm.get('yearWiewGraphE').setValue(false)
    this.loadgraphDataEnergy()
  }

  chartmonthlyViewE() {
    if (this.chart) {
      this.chart.destroy()
    }
    /* this.isYearViewE = !this.isMonthViewE
    this.isQuarterViewE = false */
    this.energyGraphForm.get('yearWiewGraphE').setValue(!this.energyGraphForm.get('monthlyViewGraphE').value)
    this.energyGraphForm.get('quarterlyViewGraphE').setValue(false)
    this.loadgraphDataEnergy()
  }

  chartkWViewE() { //visualizar en kWh
    if (this.chart) {
      this.chart.destroy()
    }
   /*  this.isMWViewE = !this.iskWViewE */
    this.energyGraphForm.get('MWView').setValue(!this.energyGraphForm.get('kWView').value)
    if (localStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (kWh)"
    }
    else {
      this.aspectEnergy = "Energía (kWh)"
    }
    this.loadgraphDataEnergy()
  }

  chartMWViewE() { /* visualizar en MWh */
    if (this.chart) {
      this.chart.destroy()
    }
    /* this.iskWViewE = !this.isMWViewE */
    this.energyGraphForm.get('kWView').setValue(!this.energyGraphForm.get('MWView').value)
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
      this.endergyDataSet.push(
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
    this.endergyDataSet = []
    this.chart.destroy()
  }

  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };
  
  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };
}
