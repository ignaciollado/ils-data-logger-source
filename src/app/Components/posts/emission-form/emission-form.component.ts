import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConsumptionDTO, emissionColumns } from 'src/app/Models/consumption.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { BillingService } from 'src/app/Services/billing.service';
import { CnaeDataService } from 'src/app/Services/cnaeData.service';
import { CnaeDataDTO } from 'src/app/Models/cnaeData.dto';
import { BillingDTO } from 'src/app/Models/billing.dto';
import { YearsDTO } from 'src/app/Models/years.dto';

@Component({
  selector: 'app-emission-form',
  templateUrl: './emission-form.component.html',
  styleUrls: ['./emission-form.component.scss'],
})
export class EmissionFormComponent {
    isLoading:boolean = true;
  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  quantityEmission: UntypedFormControl
  scopeone: UntypedFormControl
  scopetwo: UntypedFormControl
  companyId: UntypedFormControl
  yearEmission: UntypedFormControl
  emissionForm: UntypedFormGroup
  theRatioType: UntypedFormControl
  objective: UntypedFormControl

  isValidForm: boolean | null
  isElevated: boolean = true
  isRatioBilling: boolean = false
  isRatioCNAE: boolean = false
  theRatioTypeSelected: boolean = false
  consumptionFields: string[] = []
  result : boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[]
  consumptions!: ConsumptionDTO[]
  billings!: BillingDTO[]
  cnaesData!: CnaeDataDTO[]
  years: YearsDTO[]

  isGridView: boolean = false
  columnsDisplayed: string[] = emissionColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<ConsumptionDTO>();
  columnsSchema: any = emissionColumns;
  valid: any = {}

  @ViewChild('emissionTbSort') emissionTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.emissionTbSort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private jwtHelper: JwtHelperService,
    private _adapter: DateAdapter<any>,
    public dialog: MatDialog,
    private billingService: BillingService,
    private cnaesDataService: CnaeDataService,

    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.consumption = new ConsumptionDTO(0, '', this._adapter.today(), this._adapter.today(), false, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '');
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.yearEmission = new UntypedFormControl('', [ Validators.required ]);
    this.quantityEmission = new UntypedFormControl({value:'', disabled: true}, [ Validators.required, Validators.min(1)]);
    this.scopeone = new UntypedFormControl({value: '', disabled: false}, [ Validators.required ]);
    this.scopetwo = new UntypedFormControl({value: '', disabled: false}, [ Validators.required ]);

    this.emissionForm = this.formBuilder.group({
      delegation: this.delegation,
      scopeone: this.scopeone,
      scopetwo: this.scopetwo,
      yearEmission: this.yearEmission,
      quantityEmission: this.quantityEmission,
    })

    this.loadDelegations();
  }

  ngOnInit(): void {
    this.loadConsumption(this.userId)
    this.loadYears()
  }

  private loadBillingProduction(userId: string){
    let errorResponse: any;
    if (this.userId) {
      this.billingService.getBillingsByCompany(userId).subscribe(
        (billings: BillingDTO[]) => {
          this.billings = billings;
          console.log("billings: ", this.billings)
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );
    }
  }

  private loadCNAEProduction(userId: string){
    let errorResponse: any;
    if (this.userId) {
        this.cnaesDataService.getCnaesDataByCompany(userId).subscribe((item: CnaeDataDTO[]) => {
          this.cnaesData = item
          console.log("cnaesData: ", this.cnaesData)
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );
    }
  }

  loadYears() {
    this.sharedService.getAllYears()
      .subscribe((years:YearsDTO[])=>{
        this.years = years
      })
  }

  private loadDelegations(): void {
    let errorResponse: any;
    if (this.userId) {
      this.delegationService.getAllDelegationsByCompanyIdFromMySQL(this.userId).subscribe(
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

  private loadConsumption(userId:string): void {
    let errorResponse: any;
    if (userId) {
        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 5).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource.data = this.consumptions
          this.dataSource.sort = this.emissionTbSort
          this.dataSource.paginator = this.paginator
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  private createEmissionConsumption(): void {
    let errorResponse: any;

    if (this.userId) {
      this.consumption.companyId = this.userId;
      this.consumption.aspectId = 5; /* Emission aspect id : 5 */
      this.consumption.companyDelegationId = this.emissionForm.get("delegation").value
      this.consumption.scopeOne = this.emissionForm.get("scopeone").value
      this.consumption.scopeTwo = this.emissionForm.get("scopetwo").value
      this.consumption.quantity = this.emissionForm.get("scopeone").value + this.emissionForm.get("scopetwo").value

      this.consumption.year = this.emissionForm.get("yearEmission").value
      this.consumptionService.createEmissionConsumption(this.consumption)
        .pipe(
          finalize(async () => {
            this.sharedService.showSnackBar( 'Registro de Emisiones creado crrectamente' );
          })
        )
        .subscribe(
          () => {
            this.yearEmission.reset()
            this.scopeone.reset()
            this.scopetwo.reset()
            this.quantityEmission.reset()
            this.sharedService.showSnackBar( 'Registro de Emisiones creado crrectamente' );
            this.loadConsumption(this.userId);
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.showSnackBar(errorResponse);
          }
        );
    }
  }

  public editPost(): void {

  }

  public getCO2(colKey:any, co2:any, e: any): void {
    let tempCO2: string[] = []
    tempCO2 = co2[colKey].split("#")
    tempCO2[0] = e.explicitOriginalTarget.value
    co2[colKey] = tempCO2[0]+"#"+tempCO2[1]+"#"+tempCO2[2]
  }

  public getScopeOne(colKey:any, scopeOne:any, e: any): void {
    let tempScopeOne: string[] = []
    tempScopeOne = scopeOne[colKey].split("#")
    tempScopeOne[1] = e.explicitOriginalTarget.value
    scopeOne[colKey] = tempScopeOne[0]+"#"+tempScopeOne[1]+"#"+tempScopeOne[2]

  }

  public getScopeTwo(colKey:any, scopeTwo:any, e: any): void {
    let tempScopeTwo: string[] = []
    tempScopeTwo = scopeTwo[colKey].split("#")
    tempScopeTwo[2] = e.explicitOriginalTarget.value
    scopeTwo[colKey] = tempScopeTwo[0]+"#"+tempScopeTwo[1]+"#"+tempScopeTwo[2]
    console.log (scopeTwo[colKey].split("#"), e.explicitOriginalTarget.value, tempScopeTwo[0], tempScopeTwo[1], tempScopeTwo[2] )
  }

  public calculatetotalQuantity() {
    this.quantityEmission.setValue( this.scopetwo.value + this.scopeone.value )
  }

  updateEmissionConsumption(consumptionId: number) {
    this.result = confirm('Confirm update this consumption with id: ' + consumptionId + ' .');
  }

  saveEmissionForm(): void {
    this.isValidForm = false;
    if (this.emissionForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.emissionForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createEmissionConsumption();
    }

  }

  public ratioBilling(): void {
    this.isRatioCNAE = false
    console.log(this.isRatioCNAE)
    this.loadConsumption(this.userId)
  }

  public ratioCNAE(): void {
    this.isRatioBilling = false
    console.log(this.isRatioBilling)
    this.loadConsumption(this.userId)
  }

  getRecord(row) {
    let errorResponse: any;
    this.consumptionService.deleteConsumption(row).subscribe(
      (rowsAffected: deleteResponse) => {
        if (rowsAffected.affected > 0) {

        }
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.showSnackBar(errorResponse);
      }
    )
    this.loadConsumption(this.userId)
  }

  public addRow() {
    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: ConsumptionDTO = {
      consumptionId: '0',
      companyId: this.userId,
      companyDelegationId: this.delegation.value,
      aspectId: 5,
      residueId: '',
      year: this.yearEmission.value,

      quantity: this.quantityEmission.value,
      energyId: 0,
      scopeOne: this.scopeone.value,
      scopeTwo: this.scopetwo.value,
      reuse: 0,
      recycling: 0,
      incineration: 0,
      dump: 0,
      compost: 0,
      energyCA: '',
      energyES: '',
      residueCA: '',
      residueES: '',
      aspectCA: '',
      aspectES: '',
      unit: '',
      pci: 1,
      isEdit: true,
      isSelected: false,
      fromDate: new Date(),
      toDate: new Date(),
      created_at: new Date(),
      objective: ''
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: ConsumptionDTO) {
    console.log (row)
    if (row.consumptionId === '0') {
      this.consumptionService.createEmissionConsumption(row).subscribe((newResidue: ConsumptionDTO) => {
        row.consumptionId = newResidue.consumptionId
        row.isEdit = false
        this.loadConsumption( this.userId )
      });
    } else {
      this.consumptionService.updateEmissionConsumption(row.consumptionId, row).subscribe(() => {
        row.isEdit = false
        this.sharedService.showSnackBar( 'Generación de emisiones modificado correctamente' );
        this.loadConsumption( this.userId )
      })
    }
    row.isEdit = false

  }

  public removeRow(item: any) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.consumptionService.deleteConsumption(item.consumptionId).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: ConsumptionDTO) => u.consumptionId !== item.consumptionId
    );
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */
    const residues = this.dataSource.data.filter((u: ConsumptionDTO) => {
      console.log (u)
      u.isSelected
    })
    this.openDialog('300ms', '300ms', "¿Eliminar de forma permantente?", "", "", "")
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.consumptionService.deleteConsumptions(residues).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: ConsumptionDTO) => !u.isSelected
            );
          });
        }
      });

     /* this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
           this.objectiveService.deleteObjective(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: ObjectiveDTO) => !u.isSelected,
            )
          })
        }
      }) */
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false)
    }
    return false
  }

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
    this.objective.enable()
    this.objective.addValidators(Validators.required)
    this.scopeone.enable()
    this.scopetwo.enable()
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, questionText: string, toolTipText: string, doc1: string, doc2: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.panelClass = "dialog-customization"
    dialogConfig.backdropClass = "popupBackdropClass"
    dialogConfig.position = {
      'top': '2rem',
      'right': '5rem'
    };
    dialogConfig.width='100%',
    dialogConfig.data = {
      questionText: questionText, toolTipText: toolTipText, doc1: doc1, doc2: doc2
    };
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
