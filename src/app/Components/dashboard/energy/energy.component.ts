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
  startPrimaryColor: number = 3
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

  constructor (
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
  '#4CAF50', // verde vivo
  '#FF9800', // naranja cálido
  '#2196F3', // azul brillante
  '#F06292', // rosa vivo
  '#9C27B0', // violeta intenso
  '#FFC107', // amarillo brillante
  '#009688', // verde azulado
  '#FF5722', // naranja profundo
  '#3F51B5', // azul oscuro
  '#E91E63', // rosa intenso
  '#8BC34A', // verde claro
  '#FFEB3B', // amarillo suave
  '#00BCD4', // cian vivo
  '#673AB7', // violeta elegante
  '#795548', // marrón terroso
  '#607D8B', // gris azulado
  '#CDDC39', // lima brillante
  '#FF7043', // coral cálido
  '#03A9F4', // azul celeste
  '#F44336'  // rojo vivo
];

    this.companyId = this.jwtHelper.decodeToken().id_ils;

    if (sessionStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (kWh)"
      this.aspectWater = "Aigua (L)"
      this.aspectResidue = "Residu (kg)"
      this.aspectEmissions = "Emissions (CO2e en T)"
    } else if (sessionStorage.getItem('preferredLang') === 'cas') {
      this.aspectEnergy = "Energía (kWh)"
      this.aspectWater = "Agua (L)"
      this.aspectResidue = "Residuo (kg)"
      this.aspectEmissions = "Emisiones (CO2e en T)"
    }

    this.delegation = new UntypedFormControl('')
    this.yearEnergy = new UntypedFormControl('')
    this.ratioBillingGraphE = new UntypedFormControl(false)
    this.ratioCNAEgGraphE = new UntypedFormControl(false)
    this.yearWiewGraphE = new UntypedFormControl(false)
    this.quarterlyViewGraphE = new UntypedFormControl(false)
    this.monthlyViewGraphE = new UntypedFormControl(true)
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
    // Paso : cargar objetivos
    this.loadObjectives(this.companyId);
  }

  private loadObjectives(companyId: string): void {
    let errorResponse: any;
    this.objectiveService.getAllObjectivesByCompany(companyId)
    .subscribe(
      (objectives: ObjectiveDTO[]) => {
        this.objectives = objectives
        this.monthlyGraphView()
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        console.error( error )
        this.sharedService.showSnackBar("Errores: "+ error);
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

  chartRatioCNAE() {
    if (this.chart) {
      this.chart.destroy()
    }
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
    if (sessionStorage.getItem('preferredLang') === 'cat') {
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
    if (sessionStorage.getItem('preferredLang') === 'cat') {
      this.aspectEnergy = "Energia (MWh)"
    }
    else {
      this.aspectEnergy = "Energía (MWh)"
    }
    this.loadgraphDataEnergy()
  }

  graphFormReset() {
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

/*         // Dataset de objetivos (línea por año y delegación)
        if (this.objectives && this.objectives.length > 0) {
          delegations.forEach((delegation) => {
    const objectiveData = labels.map(year => {
      // Encontrar objetivo del año y delegación
      const obj = this.objectives.find(o => +o.year === +year && o.delegation === delegation);
      if (!obj) return 0;

      // Sumar todos los meses
      const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
      return months.reduce((sum, month) => sum + (+obj[month] || 0), 0);
    });

    this.endergyDataSet.push({
      label: `Objetivo - ${delegation}`,
      data: objectiveData,
      type: 'line',
      borderColor: '#ff5722',
      borderWidth: 2,
      fill: false,
      pointRadius: 5,
      pointBackgroundColor: '#ff5722',
      yAxisID: 'y'
    });
          });
        } */
  
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

monthlyGraphView(selectedYear?: string) {
  this.energyGraphForm.get('yearWiewGraphE').setValue(false);
  this.energyGraphForm.get('quarterlyViewGraphE').setValue(false);

  this.consumptionService.getMonthlyEnergyByCompanyId(this.companyId)
    .subscribe((rawConsumptions: ConsumptionDTO[]) => {
      const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

      // Transformar los datos para tener una fila por mes y año
      this.consumptions = [];
      rawConsumptions.forEach(item => {
        if (!selectedYear || item.year === selectedYear) {
          this.energies.forEach((energy: EnergyDTO) => {
            if (energy.nameES === item.energyName) {
              monthKeys.forEach(month => {
                this.consumptions.push({
                  delegation: item.delegation,
                  energyName: item.energyName,
                  year: item.year,
                  month,
                  totalYear: (+item[month] || 0) * energy.pci * energy.convLKg
                });
              });
            }
          });
        }
      });

      // Labels para eje X (meses)
      this.labels = monthKeys.map(m => m.toUpperCase());

      // Delegaciones, energías y años únicos
      const delegations = Array.from(new Set(this.consumptions.map(c => c.delegation)));
      const energyNames = Array.from(new Set(this.consumptions.map(c => c.energyName)));
      const years = Array.from(new Set(this.consumptions.map(c => c.year)));

      // Mapear un color por año
      const yearColors = years.reduce((acc, year, index) => {
        acc[year] = this.primaryColors[index % this.primaryColors.length];
        return acc;
      }, {} as {[key: string]: string});

      // Preparar datasets de consumo por año
      this.endergyDataSet = [];
      years.forEach(year => {
        delegations.forEach(delegation => {
          energyNames.forEach(energy => {
            const data = monthKeys.map(month => {
              return this.consumptions
                .filter(c => c.year === year && c.month === month && c.delegation === delegation && c.energyName === energy)
                .reduce((sum, c) => sum + +c.totalYear, 0);
            });

            this.endergyDataSet.push({
              label: `${delegation} - ${energy} (${year})`,
              data,
              backgroundColor: yearColors[year],
              stack: `${delegation}-${year}`
            });
          });
        });
      });

      // Agregar datasets de objetivos por año
      if (this.objectives && this.objectives.length > 0) {
        years.forEach(year => {
          delegations.forEach(delegation => {
            const objectiveData = monthKeys.map(month => {
              const obj = this.objectives.find(o => o.delegation === delegation && o.year === year);
              return obj ? +obj[month] || 0 : 0;
            });

            this.endergyDataSet.push({
              label: `Objetivo - ${delegation} (${year})`,
              data: objectiveData,
              type: 'line',
              borderColor: '#ff5722',
              borderWidth: 1,
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: '#0E5F0EFF',
              yAxisID: 'y'
            });
          });
        });
      }

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
            legend: { display: true, position: 'right', labels: { color: '#365446', boxWidth: 20, padding: 8 }, maxHeight: 300 },
            title: { display: true, text: `Consumo energético ${selectedYear || 'Todos los años'}` }
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
