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

const EMISSION_DATA = [
  {Id: 1, delegation: "Mock data", year: "2019", "jan": 15000000, "janScope1": 10000000, "janScope2": 5000000,"feb": 15000000, "febScope1": 10000000, "febScope2": 5000000, "mar": 15000000, "marScope1": 10000000, "marScope2": 5000000, "apr": 15000000, "aprScope1": 10000000, "aprScope2": 5000000, "may": 15000000, "mayScope1": 10000000, "mayScope2": 5000000,
   "jun": 15000000, "junScope1": 10000000, "junScope2": 5000000, "jul": 15000000, "julScope1": 10000000, "julScope2": 5000000, "aug": 15000000, "augScope1": 10000000, "augScope2": 5000000, "sep": 15000000, "sepScope1": 10000000, "sepScope2": 5000000, "oct": 15000000, "octScope1": 10000000, "octScope2": 5000000, "nov": 15000000, "novScope1": 10000000, "novScope2": 5000000, "dec": 15000000, "decScope1": 10000000, "decScope2": 5000000,},
  {Id: 2, delegation: "Mock data", year: "2020", "jan": "15000000 10000000 5000000"},
  {Id: 3, delegation: "Mock data", year: "2019", "jan": "15000000 10000000 5000000", "feb": "15000000 10000000 5000000"},
  {Id: 4, delegation: "Mock data", year: "2020", "jan": "15000000 10000000 5000000"}
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
  /* columnsDisplayed = ['delegation', 'year', 'quantity', 'objective', 'scopeone', 'scopetwo', 'ACTIONS']; */
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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.yearEmission = new UntypedFormControl('', [ Validators.required ]);
    this.quantityEmission = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
    this.scopeone = new UntypedFormControl({value: '', disabled: true}, [ Validators.required ]);
    this.scopetwo = new UntypedFormControl({value: '', disabled: true}, [ Validators.required ]);

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

  private editPost(): void {

  }

  deleteEmissionConsumption(consumptionId: number) {

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
    console.log(row);
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
      residueId: 0,
      year: this.yearEmission.value,
      jan: '0',
      feb: '0',
      mar: '0',
      apr: '0',
      may: '0',
      jun: '0',
      jul: '0',
      aug: '0',
      sep: '0',
      oct: '0',
      nov: '0',
      dec: '0',
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
      this.consumptionService.createResidueConsumption(row).subscribe((newResidue: ConsumptionDTO) => {
        row.consumptionId = newResidue.consumptionId
        row.isEdit = false
        this.loadConsumption( this.userId )
      });
    } else {
      this.consumptionService.updateConsumptions(row.consumptionId, row).subscribe(() => {
        row.isEdit = false
        this.loadConsumption( this.userId )
      })
    }
    row.isEdit = false

  }

  public removeRow(id: any) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.consumptionService.deleteConsumption(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: ConsumptionDTO) => u.consumptionId !== id
    );
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */

    const residues = this.dataSource.data.filter((u: ConsumptionDTO) => u.isSelected);
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
