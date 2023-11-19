import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BillingColumns, BillingDTO } from 'src/app/Models/billing.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { BillingService } from 'src/app/Services/billing.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

const BILLING_DATA = [
  {Id: 1, delegation: "Son Castelló", year: "2019", "jan": 15000000, "feb": 15000000, "mar": 15000000, "apr": 15000000, "may": 15000000
  , "jun": 15000000, "jul": 15000000, "aug": 15000000, "sep": 15000000, "oct": 15000000, "nov": 15000000, "dec": 15000000},
  {Id: 2, delegation: "Can Valero", year: "2020", "jan": 10000000.300},
  {Id: 3, delegation: "Son Castelló", year: "2019", "jan": 10000500.57, "feb": 10222222.4579},
  {Id: 4, delegation: "Son Castelló", year: "2020", "jan": 20500000.2550},
  {Id: 5, delegation: "Son Castelló", year: "2023", "jan": 30000000.2550}
];


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [
    trigger( 'fadeInOut',[
      state(
        'void',
        style({
          opacity: 0.2
        })
      ),
      transition('void <-> *', animate(1500))
    ])
  ],
})

export class BillingComponent {

  billing: BillingDTO
  delegation: UntypedFormControl
  companyId: UntypedFormControl
  yearBilling: UntypedFormControl
  quantity: UntypedFormControl
  billingForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  result: boolean = false

  genCnae: UntypedFormControl
  febCnae: UntypedFormControl
  marCnae: UntypedFormControl
  aprCnae: UntypedFormControl
  mayCnae: UntypedFormControl
  junCnae: UntypedFormControl
  julCnae: UntypedFormControl
  augCnae: UntypedFormControl
  sepCnae: UntypedFormControl
  octCnae: UntypedFormControl
  novCnae: UntypedFormControl
  decCnae: UntypedFormControl

  genBill: UntypedFormControl
  febBill: UntypedFormControl
  marBill: UntypedFormControl
  aprBill: UntypedFormControl
  mayBill: UntypedFormControl
  junBill: UntypedFormControl
  julBill: UntypedFormControl
  augBill: UntypedFormControl
  sepBill: UntypedFormControl
  octBill: UntypedFormControl
  novBill: UntypedFormControl
  decBill: UntypedFormControl

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  billings!: BillingDTO[];

  isGridView: boolean = false
  columnsDisplayed: string[] = BillingColumns.map((col) => col.key);
  //dataSource: any = BILLING_DATA
  dataSource = new MatTableDataSource<BillingDTO>()
  columnsSchema: any = BillingColumns;

  valid: any = {}

  @ViewChild('billingTbSort') billingTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.billingTbSort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private billingService: BillingService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private jwtHelper: JwtHelperService,
    public dialog: MatDialog,
    private _adapter: DateAdapter<any>,

    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.billing = new BillingDTO (0, 0, 0, false, false, '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.yearBilling = new UntypedFormControl('', [ Validators.required ]);

    this.billingForm = this.formBuilder.group({
      delegation: this.delegation,
      yearBilling: this.yearBilling
    })
    this.loadDelegations( this.userId );
  }

  ngOnInit() {
    this.loadBillings( this.userId )
  }

  private loadDelegations(userId: string): void {
    let errorResponse: any;
    if (this.userId) {
      this.delegationService.getAllDelegationsByCompanyIdFromMySQL(userId).subscribe(
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

  private loadBillings(userId: string): void {
    let errorResponse: any;
    if (this.userId) {
      this.billingService.getBillingsByCompany(userId).subscribe(
        (billings: BillingDTO[]) => {
          this.dataSource.data = billings;
          this.dataSource.sort = this.billingTbSort
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );
    }
  }

/*   deleteBilling(billingId: number): void {
    let errorResponse: any;
    this.result = confirm('Confirm delete this billing.');
    if (this.result) {
      this.billingService.deleteBilling(billingId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
          this.loadBillings(this.userId)
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadBillings(this.userId)
    }
  } */

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: BillingDTO = {
      Id: 0,
      companyId: +this.userId,
      companyDelegationId: this.delegation.value,
      year: this.yearBilling.value,
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
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: BillingDTO) {
    if (row.Id == 0) {
      this.billingService.createBilling(row).subscribe((newObjective: BillingDTO) => {
        row.Id = newObjective.Id
        row.isEdit = false
        this.loadBillings( this.userId )
      });
    } else {
      this.billingService.updateBilling(row.Id, row).subscribe(() => {
        row.isEdit = false
        this.loadBillings( this.userId )
      })
    }
    row.isEdit = false

  }
  public removeRow(id: any) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.billingService.deleteBilling(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: BillingDTO) => u.Id !== id
    );
  });
  }
  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */

    const billings = this.dataSource.data.filter((u: BillingDTO) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.billingService.deleteBillings(billings).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: BillingDTO) => !u.isSelected
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

  public disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false)
    }
    return false
  }

  public isAllSelected() {
    /* return this.dataSource.every((item: any) => item.isSelected); */
  }

  public isAnySelected() {
    /* return this.dataSource.some((item: any) => item.isSelected); */
  }

  public selectAll(event) {
    /* this.dataSource = this.dataSource.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    })); */
  }

}
