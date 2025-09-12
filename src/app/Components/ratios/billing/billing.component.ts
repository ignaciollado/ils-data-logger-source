import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute } from '@angular/router';
import { BillingColumns, BillingDTO } from 'src/app/Models/billing.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { BillingService } from 'src/app/Services/billing.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JwtHelperService } from '@auth0/angular-jwt';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { YearsDTO } from 'src/app/Models/years.dto';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize } from 'rxjs';

registerLocaleData(localeEs, 'es')

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
  isLoading: boolean = true
  billing: BillingDTO
  years: YearsDTO[]
  delegation: UntypedFormControl
  companyId: UntypedFormControl
  yearBilling: UntypedFormControl
  quantity: UntypedFormControl
  billingForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  result: boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  billings!: BillingDTO[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isGridView: boolean = false
  columnsDisplayed: string[] = BillingColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<BillingDTO>()
  columnsSchema: any = BillingColumns;

  valid: any = {}

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

    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.yearBilling = new UntypedFormControl('', [ Validators.required ]);

    this.billingForm = this.formBuilder.group({
      delegation: this.delegation,
      yearBilling: this.yearBilling
    })
    this.loadDelegations( this.userId );
  }

  ngOnInit() {
    this.loadBillings(this.userId);
    this.loadYears(); 
  } 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadDelegations(userId: string): void {
    let errorResponse: any;
    if (this.userId) {
      this.delegationService.getAllDelegationsByCompanyIdFromMySQL(userId).subscribe(
        (delegations: DelegationDTO[]) => {
          this.delegations = delegations
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
          this.dataSource.data = billings
          this.isLoading = false
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.showSnackBar(errorResponse)
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

  public addRow() {
  const newRow: BillingDTO = {
    companyId: +this.userId,
    companyDelegationId: this.delegation.value,
    year: this.yearBilling.value,
  };

  this.billingService.createBilling(newRow)
   . pipe(
      finalize(() => {
        // Opcional: puede mostrar algo siempre que finalice
        this.sharedService.showSnackBar('Petición completada');
      })
    )
    .subscribe({
      next: (createdBilling: BillingDTO) => {
        // Éxito
        newRow.Id = createdBilling.Id;
        newRow.isEdit = false;
        this.loadBillings(this.userId);
        this.sharedService.showSnackBar('Dato de facturación añadido correctamente');
        this.yearBilling.reset()
      },
      error: (err) => {
        // Manejo de error
        this.sharedService.showSnackBar('Error al añadir el dato de facturación '+err);
      }
    });
  }

  public editRow(row: BillingDTO) {
    if (row.Id == 0) {
      this.billingService.createBilling(row)
     . pipe(
      finalize(() => {
        // Opcional: puede mostrar algo siempre que finalice
        this.sharedService.showSnackBar('Petición completada');
      })
      )    
      .subscribe({
      next: (createdBilling: BillingDTO) => {
        // Éxito
        row.Id = createdBilling.Id;
        row.isEdit = false;
        this.loadBillings(this.userId);
        this.sharedService.showSnackBar('Dato de facturación actualizado correctamente');
        this.yearBilling.reset()
      },
      error: (err) => {
        // Manejo de error
        this.sharedService.showSnackBar('Error al añadir el dato de facturación '+err);
      }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
