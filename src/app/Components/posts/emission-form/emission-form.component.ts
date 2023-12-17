import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'

/* const EMISSION_DATA = [
  {Id: 1, delegation: "Mock data 1", year: "2019", "jan": '8#12#15', "feb": '150000000#10000000#5000000', "mar": '15#10#5', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 2, delegation: "Mock data 1", year: "2020", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 3, delegation: "Mock data 2", year: "2020", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 4, delegation: "Mock data 2", year: "2021", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 6, delegation: "Mock data 3", year: "2020", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 7, delegation: "Mock data 3", year: "2021", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 8, delegation: "Mock data 4", year: "2019", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
   {Id: 9, delegation: "Mock data 4", year: "2020", "jan": '1111111#122222#333333', "feb": '16000000#122222#333333', "mar": '15000000#122222#333333', "apr": '15000000#122222#333333', "may": '55000000#122222#333333',
   "jun": '16000000#122222#333333', "jul": '15000000#122222#333333', "aug": '15000000#122222#333333', "sep": '15000000#122222#333333', "oct": '15000000#122222#333333', "nov": '15000000#122222#333333', "dec": '15000000#122222#333333'},
]; */

const EMISSION_DATA = [
   {Id: 1, delegation: "Mock data 1", year: "2019", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 2, delegation: "Mock data 1", year: "2020", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 3, delegation: "Mock data 2", year: "2020", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 4, delegation: "Mock data 2", year: "2021", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 6, delegation: "Mock data 3", year: "2020", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 7, delegation: "Mock data 3", year: "2021", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 8, delegation: "Mock data 4", year: "2019", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
   {Id: 9, delegation: "Mock data 4", year: "2020", quantity: '100.25', scopeOne: '99.25', scopeTwo: '10.75'},
];


@Component({
  selector: 'app-emission-form',
  templateUrl: './emission-form.component.html',
  styleUrls: ['./emission-form.component.scss'],
})
export class EmissionFormComponent {
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
  theRatioTypeSelected: boolean = false
  consumptionFields: string[] = []
  result : boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed: string[] = emissionColumns.map((col) => col.key);
  dataSource: any = EMISSION_DATA
  //dataSource = new MatTableDataSource<ConsumptionDTO>();
  columnsSchema: any = emissionColumns; 
  /* columnsDisplayed = ['Id', 'delegation', 'year', 'jan', 'feb', 'mar', 'apr', 'ACTIONS'];  */
  valid: any = {}

  @ViewChild('emissionTbSort') emissionTbSort = new MatSort();

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
    this.quantityEmission = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
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
    this.loadConsumption(this.userId);
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
          this.dataSource = new MatTableDataSource(this.consumptions)
          this.dataSource.sort = this.emissionTbSort
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
    let responseOK: boolean = false;

    if (this.userId) {
      this.consumption.companyId = this.userId;
      this.consumption.aspectId = 5; /* Emission aspect id : 5 */
      this.consumptionService.createEmissionConsumption(this.consumption)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'postFeedback',
              responseOK,
              errorResponse
            );

            /* if (responseOK) {
              this.router.navigateByUrl('posts');
            } */
          })
        )
        .subscribe(
          () => {
            responseOK = true;
            this.quantityEmission.reset()
            this.yearEmission.reset()
            this.scopeone.reset()
            this.scopetwo.reset()
            this.loadConsumption(this.userId);
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
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

  public calculateScopeTwo() {
    this.scopetwo.setValue( this.quantityEmission.value - this.scopeone.value )
  }

/*   deleteEmissionConsumption(consumptionId: number) {

    let errorResponse: any;
    this.result = confirm('Confirm delete this emission');

    if (this.result) {
      this.consumptionService.deleteConsumption(consumptionId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadConsumption(this.userId)
    }
  }
 */
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

  getRecord(row) {
    let errorResponse: any;
    this.consumptionService.deleteConsumption(row).subscribe(
      (rowsAffected: deleteResponse) => {
        if (rowsAffected.affected > 0) {

        }
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
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
      delegation: this.delegation.value,
      aspectId: 5,
      residueId: '',
      year: this.yearEmission.value,
      
      quantity: this.quantityEmission.value,
      energy: 0,
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
    
    this.dataSource = this.dataSource.filter((u: any) => !u.isSelected);
    const residues = this.dataSource.data.filter((u: ConsumptionDTO) => {
      console.log (u)
      u.isSelected
    })
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

/*   public isAllSelected():boolean {
    return this.dataSource.every((item: any) => item.isSelected);
  }
 */
/*   public isAnySelected():boolean {
    return this.dataSource.some((item: any) => item.isSelected);
  } */

/*   public selectAll(event):void {
    this.dataSource = this.dataSource.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    }));
  } */

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
    this.objective.enable()
    this.objective.addValidators(Validators.required)
    this.scopeone.enable()
    this.scopetwo.enable()
  }

}
