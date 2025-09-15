import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { SharedService } from 'src/app/Services/shared.service'
import Chart, { ChartData, ChartOptions } from 'chart.js/auto'
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

  values: number[] = [];
  labels: string[] = [];
  
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
    this.yearlyGraphView()
 /*    if (this.energyGraphForm.get('yearWiewGraphE').value) {  //visualización por años
      this.consumptionService.getYearlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        // Conversión a kWh 
        this.consumptions.forEach(item => {
          this.energies.forEach((energy: EnergyDTO) => {
            if (energy.nameES === item.energyName) {
              item.totalYear = item.totalYear * energy.pci * energy.convLKg;
            }
          });
        });

        // Determinar la clave de agrupación
        let groupKey: string;
        if (yearView) groupKey = 'year';
        else if (quarterlyView) groupKey = 'quarter'; // asegúrate que consumptions tenga la propiedad quarter
        else if (monthlyView) groupKey = 'month';
        else groupKey = 'year';

        // Obtener labels únicos para el eje X
        const labels = Array.from(new Set(this.consumptions.map(c => c[groupKey]))).sort();
        this.labels = labels;

        // Delegaciones y tipos de energía únicos
        const delegations = Array.from(new Set(this.consumptions.map(c => c.delegation)));
        const energyNames = Array.from(new Set(this.consumptions.map(c => c.energyName)));

        // Preparar datasets: cada dataset = delegación + energía
        this.endergyDataSet = [];
        delegations.forEach((delegation, dIndex) => {
          energyNames.forEach((energy, eIndex) => {
            const data = labels.map(label => {
              return this.consumptions
                .filter(c => c[groupKey] === label && c.delegation === delegation && c.energyName === energy)
                .reduce((sum, c) => sum + +c.totalYear, 0);
            });

            this.endergyDataSet.push({
              label: `${delegation} - ${energy}`,
              data,
              backgroundColor: this.primaryColors[(dIndex + eIndex) % this.primaryColors.length],
              stack: delegation
            });
          });
        });

        // Destruir gráfico previo si existe
        if (this.chart) this.chart.destroy();

        // Crear gráfico apilado
        this.chart = new Chart('energyGraph', {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.endergyDataSet
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'bottom', labels: { color: '#365446' } },
              title: { display: true, text: 'Consumo energético' }
            },
            interaction: { intersect: true },
            scales: {
              x: { stacked: true, title: { display: true, text: groupKey } },
              y: { stacked: true, beginAtZero: true, title: { display: true, text: 'kWh' } }
            }
          }
        });
      },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
      )
    } */

/*     if (this.energyGraphForm.get('quarterlyViewGraphE').value) { //visualización por trimestres
      this.consumptionService.getQuarterlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        console.log ("this.consumptions ", this.consumptions, this.companyId)
        this.consumptions.forEach((consumption: any) =>
        {
          // Conversión a kWh 
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
        // if (this.isRatioBillingE) { 
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
    } */

/*     if (this.energyGraphForm.get('monthlyViewGraphE').value) { //visualización por meses
      this.consumptionService.getMonthlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        this.consumptions.forEach((consumption: any) =>
        {
          // Conversión a kWh 
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
    } */

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

/*   chartResidueGenerate(){
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

  } */

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

  chartkWViewE() { //visualizar en kWh
    if (this.chart) {
      this.chart.destroy()
    }
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
/*     this.delegation.reset()
    this.energy.reset() */
    this.endergyDataSet = []
    this.chart.destroy()
  }

  onChartHover = ($event: any) => {
    window.console.log('onChartHover', $event);
  };
  
  onChartClick = ($event: any) => {
    window.console.log('onChartClick', $event);
  };

  yearlyGraphView() {
      this.energyGraphForm.get('quarterlyViewGraphE').setValue(false)
      this.energyGraphForm.get('monthlyViewGraphE').setValue(false)

      this.consumptionService.getYearlyEnergyByCompanyId(this.companyId)
      .subscribe(
      (consumptions: ConsumptionDTO[]) => {
        this.consumptions = consumptions
        // Conversión a kWh 
        this.consumptions.forEach(item => {
          this.energies.forEach((energy: EnergyDTO) => {
            if (energy.nameES === item.energyName) {
              item.totalYear = item.totalYear * energy.pci * energy.convLKg;
            }
          });
        });

        // Determinar la clave de agrupación
        let groupKey: string;
        groupKey = "year"
        // Obtener labels únicos para el eje X
        const labels = Array.from(new Set(this.consumptions.map(c => c[groupKey]))).sort();
        this.labels = labels;

        // Delegaciones y tipos de energía únicos
        const delegations = Array.from(new Set(this.consumptions.map(c => c.delegation)));
        const energyNames = Array.from(new Set(this.consumptions.map(c => c.energyName)));

        // Preparar datasets: cada dataset = delegación + energía
        this.endergyDataSet = [];
        delegations.forEach((delegation, dIndex) => {
          energyNames.forEach((energy, eIndex) => {
            const data = labels.map(label => {
              return this.consumptions
                .filter(c => c[groupKey] === label && c.delegation === delegation && c.energyName === energy)
                .reduce((sum, c) => sum + +c.totalYear, 0);
            });

            this.endergyDataSet.push({
              label: `${delegation} - ${energy}`,
              data,
              backgroundColor: this.primaryColors[(dIndex + eIndex) % this.primaryColors.length],
              stack: delegation
            });
          });
        });

        // Destruir gráfico previo si existe
        if (this.chart) this.chart.destroy();

        // Crear gráfico apilado
        this.chart = new Chart('energyGraph', {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.endergyDataSet
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'bottom', labels: { color: '#365446' } },
              title: { display: true, text: 'Consumo energético' }
            },
            interaction: { intersect: true },
            scales: {
              x: { stacked: true, title: { display: true, text: groupKey } },
              y: { stacked: true, beginAtZero: true, title: { display: true, text: 'kWh' } }
            }
          }
        });
      },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
      )
  }

  quarterlyGraphView() {
  this.energyGraphForm.get('yearWiewGraphE').setValue(false);
  this.energyGraphForm.get('monthlyViewGraphE').setValue(false);

  this.consumptionService.getQuarterlyEnergyByCompanyId(this.companyId)
    .subscribe(
      (consumptionsQ: any) => {
        const rawConsumptions = consumptionsQ.result;
        // Transformar los datos para tener una fila por trimestre
        this.consumptions = [];
        rawConsumptions.forEach(item => {
          this.energies.forEach((energy: EnergyDTO) => {
            if (energy.nameES === item.energyName) {
              ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
                this.consumptions.push({
                  delegation: item.delegation,
                  energyName: item.energyName,
                  year: item.year,
                  quarter,
                  totalYear: (+item[quarter] || 0) * energy.pci * energy.convLKg // Conversión a kWh
                });
              });
            }
          });
        });

        // Clave de agrupación
        const groupKey = 'quarter';

        // Labels para el eje X (trimestres)
        this.labels = ['Q1', 'Q2', 'Q3', 'Q4'];

        // Delegaciones y energías únicas
        const delegations = Array.from(new Set(this.consumptions.map(c => c.delegation)));
        const energyNames = Array.from(new Set(this.consumptions.map(c => c.energyName)));

        // Preparar datasets
        this.endergyDataSet = [];
        delegations.forEach((delegation, dIndex) => {
          energyNames.forEach((energy, eIndex) => {
            const data = this.labels.map(label => {
              return this.consumptions
                .filter(c => c[groupKey] === label && c.delegation === delegation && c.energyName === energy)
                .reduce((sum, c) => sum + +c.totalYear, 0);
            });

            this.endergyDataSet.push({
              label: `${delegation} - ${energy}`,
              data,
              backgroundColor: this.primaryColors[(dIndex + eIndex) % this.primaryColors.length],
              stack: delegation
            });
          });
        });

        // Destruir gráfico previo si existe
        if (this.chart) this.chart.destroy();

        // Crear gráfico apilado
        this.chart = new Chart('energyGraph', {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.endergyDataSet
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'bottom', labels: { color: '#365446' } },
              title: { display: true, text: 'Consumo energético' }
            },
            interaction: { intersect: true },
            scales: {
              x: { stacked: true, title: { display: true, text: 'Trimestre' } },
              y: { stacked: true, beginAtZero: true, title: { display: true, text: 'kWh' } }
            }
          }
        });
      },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
    );
  }

  monthlyGraphView() {
  this.energyGraphForm.get('yearWiewGraphE').setValue(false);
  this.energyGraphForm.get('quarterlyViewGraphE').setValue(false);

  this.consumptionService.getMonthlyEnergyByCompanyId(this.companyId)
    .subscribe(
      (rawConsumptions: ConsumptionDTO[]) => {
        // Transformar los datos para tener una fila por mes
        this.consumptions = [];
        const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

        rawConsumptions.forEach(item => {
          this.energies.forEach((energy: EnergyDTO) => {
            if (energy.nameES === item.energyName) {
              monthKeys.forEach(month => {
                this.consumptions.push({
                  delegation: item.delegation,
                  energyName: item.energyName,
                  year: item.year,
                  month,
                  totalYear: (+item[month] || 0) * energy.pci * energy.convLKg // conversión a kWh
                });
              });
            }
          });
        });

        // Clave de agrupación
        const groupKey = 'month';

        // Labels para eje X (meses)
        this.labels = monthKeys.map(m => m.toUpperCase());

        // Delegaciones y energías únicas
        const delegations = Array.from(new Set(this.consumptions.map(c => c.delegation)));
        const energyNames = Array.from(new Set(this.consumptions.map(c => c.energyName)));

        // Preparar datasets
        this.endergyDataSet = [];
        delegations.forEach((delegation, dIndex) => {
          energyNames.forEach((energy, eIndex) => {
            const data = monthKeys.map(month => {
              return this.consumptions
                .filter(c => c[groupKey] === month && c.delegation === delegation && c.energyName === energy)
                .reduce((sum, c) => sum + +c.totalYear, 0);
            });

            this.endergyDataSet.push({
              label: `${delegation} - ${energy}`,
              data,
              backgroundColor: this.primaryColors[(dIndex + eIndex) % this.primaryColors.length],
              stack: delegation
            });
          });
        });

        // Destruir gráfico previo si existe
        if (this.chart) this.chart.destroy();

        // Crear gráfico apilado
        this.chart = new Chart('energyGraph', {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.endergyDataSet
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'bottom', labels: { color: '#365446' } },
              title: { display: true, text: 'Consumo energético' }
            },
            interaction: { intersect: true },
            scales: {
              x: { stacked: true, title: { display: true, text: 'Mes' } },
              y: { stacked: true, beginAtZero: true, title: { display: true, text: 'kWh' } }
            }
          }
        });

      },
      (error: HttpErrorResponse) => {
        this.sharedService.showSnackBar(error.error);
      }
    );
  }

}
