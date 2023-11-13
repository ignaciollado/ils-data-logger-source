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
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { BillingService } from 'src/app/Services/billing.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  monthYearDate: UntypedFormControl
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
  /* dataSource = new MatTableDataSource(this.billings); */
  dataSource = new MatTableDataSource<BillingDTO>()
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
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService,
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

    this.delegation = new UntypedFormControl( 19, [ Validators.required ] );
    this.companyId = new UntypedFormControl( 284, [ Validators.required ] );
    this.monthYearDate = new UntypedFormControl('', [ Validators.required, Validators.min(1), Validators.max(12) ]);
    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);

    this.billingForm = this.formBuilder.group({
      delegation: this.delegation,
      monthYearDate: this.monthYearDate,
      quantity: this.quantity,
    })
    this.loadDelegations();
    this.loadBillings(this.userId);
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

  private createBilling(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.jwtHelper.decodeToken().id_ils;

    if (userId) {
      this.billing.companyId = userId;
      this.billingService.createBilling(this.billing)
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
            this.monthYearDate.reset()
            this.quantity.reset()
            this.loadBillings();
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

  deleteBilling(billingId: number): void {
    let errorResponse: any;
    this.result = confirm('Confirm delete this billing.');
    if (this.result) {
      this.billingService.deleteBilling(billingId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadBillings()
    }
  }

  saveBillingForm(): void {
    this.isValidForm = false;
    if (this.billingForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.billing = this.billingForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createBilling();
    }
  }

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public saveObjectiveForm( ) {
   /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
  /*   this.dataSource = [...this.dataSource, newRow];  */
  }

  public copyCnaeMonthValue( resource: string ) {
    this.genCnae.setValue( resource )
    this.febCnae.setValue( resource )
    this.marCnae.setValue( resource )
    this.aprCnae.setValue( resource )

    this.mayCnae.setValue( resource )
    this.junCnae.setValue( resource )
    this.julCnae.setValue( resource )
    this.augCnae.setValue( resource )

    this.sepCnae.setValue( resource )
    this.octCnae.setValue( resource )
    this.novCnae.setValue( resource )
    this.decCnae.setValue( resource )
  }

  public copyBillingMonthValue( resource: string ) {
    this.genBill.setValue( resource )
    this.febBill.setValue( resource )
    this.marBill.setValue( resource )
    this.aprBill.setValue( resource )

    this.mayBill.setValue( resource )
    this.junBill.setValue( resource )
    this.julBill.setValue( resource )
    this.augBill.setValue( resource )

    this.sepBill.setValue( resource )
    this.octBill.setValue( resource )
    this.novBill.setValue( resource )
    this.decBill.setValue( resource )
  }

  public deleteObjective( objectiveId: string) {

  }

  public addRow() {
    let environmentalDataEnergy: number = 0
    let environmentalDataResidue: number = 0
    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */
    
    if (this.environmentalData.value.aspect == 1) {
      environmentalDataEnergy = this.environmentalData.value.idEnv
      environmentalDataResidue = 0
    }
    if (this.environmentalData.value.aspect == 2) {
      environmentalDataEnergy = 0
      environmentalDataResidue = 0
    }
    if (this.environmentalData.value.aspect == 3) {
      environmentalDataEnergy = 0
      environmentalDataResidue = this.environmentalData.value.idEnv
    }
    if (this.environmentalData.value.aspect == 5) {
      environmentalDataEnergy = 0
      environmentalDataResidue = 0
    }
    const newRow: ObjectiveDTO = {
      Id: 0,
      companyId: this.userId,
      companyDelegationId: this.delegation.value,
      aspectId: this.environmentalData.value.aspect,
      theRatioType: this.objectiveType.value,
      energyId: environmentalDataEnergy,
      residueId: environmentalDataResidue,
      year: this.yearObjective.value,
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  editRow(row: BillingDTO) {
    if (row.Id === 0) {
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

    const users = this.dataSource.data.filter((u: ObjectiveDTO) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.objectiveService.deleteObjectives(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: ObjectiveDTO) => !u.isSelected
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
