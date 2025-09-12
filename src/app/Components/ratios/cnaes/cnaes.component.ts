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
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'

import { CnaeColumns, CnaeDataDTO } from 'src/app/Models/cnaeData.dto';
import { CnaeDataService } from 'src/app/Services/cnaeData.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';
import { YearsDTO } from 'src/app/Models/years.dto';
import { finalize } from 'rxjs';
import { IlsCnaeActivityEmissionIndicatorService } from 'src/app/Services/ils-cnae-activity-emission-inidicator.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-persons',
  templateUrl: './cnaes.component.html',
  styleUrls: ['./cnaes.component.scss'],
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

export class CnaesComponent {

  cnaeData: CnaeDataDTO
  cnaesData: CnaeDataDTO[]
  years: YearsDTO[]
  delegation: UntypedFormControl
  companyId: UntypedFormControl
  yearCnae: UntypedFormControl
  cnaeForm: UntypedFormGroup
  userFields: string[] = []

  isValidForm: boolean | null
  isElevated: boolean = true
  consumptionFields: string[] = []
  result: boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;
  currentActivityIndicator: string = "Not selected"

  delegations!: DelegationDTO[];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isGridView: boolean = false
  columnsDisplayed: string[] = CnaeColumns.map((col) => col.key)
  dataSource = new MatTableDataSource<CnaeDataDTO>()
  columnsSchema: any = CnaeColumns

  valid: any = {}

  constructor(
    private activatedRoute: ActivatedRoute,
    private cnaesDataService: CnaeDataService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private jwtHelper: JwtHelperService,
    public dialog: MatDialog,
    private ilsCnaeService: IlsCnaeActivityEmissionIndicatorService,
    private _adapter: DateAdapter<any>,

    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils;

    this.cnaeData = new CnaeDataDTO(0, 0, 0, '', false, false, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.isUpdateMode = false;
    this.validRequest = false;

    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.yearCnae = new UntypedFormControl('', [ Validators.required ]);

    this.cnaeForm = this.formBuilder.group({
      delegation: this.delegation,
      yearCnae: this.yearCnae,
    })
    this.loadDelegations()
    this.getCurrentIndicator( this.userId )
  }

  ngOnInit() {
    this.loadCnaeData( this.userId )
    this.loadYears()
  }

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
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

  private loadCnaeData( userId: string ): void {
    let errorResponse: any;
    if (this.userId) {
        this.cnaesDataService.getCnaesDataByCompany(userId).subscribe((item: CnaeDataDTO[]) => {
          this.dataSource.data = item
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

  private getCurrentIndicator( userId: string ) {
    let errorResponse: any;
    if (this.userId) {
      this.userService.getUSerByIdMySQL(userId).subscribe(
        (userData: UserDTO) => {
          console.log ("userData", userData.cnae)
          this.ilsCnaeService.getAll()
            .subscribe((cnaeItems:any) => {
              cnaeItems.filter((cnae:any) => {
                if (cnae.cnaeCode === userData.cnae) {
                  console.log (JSON.parse(cnae.activityIndicator)[0]['indicator'])
                  this.currentActivityIndicator = JSON.parse(cnae.activityIndicator)[0]['indicator']
                }
              })
          })
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  public addRow() {
    const newRow: CnaeDataDTO = {
      companyId: +this.userId,
      companyDelegationId: this.delegation.value,
      cnaeUnitSelected: this.currentActivityIndicator,
      year: this.yearCnae.value,
    };
   this.cnaesDataService.createCnaeData(newRow)
    .pipe(
         finalize(() => {
           // Opcional: puede mostrar algo siempre que finalice
           this.sharedService.showSnackBar('Petición completada');
         })
      )
    .subscribe({
      next: (createdCnae: CnaeDataDTO) => {
        // Éxito
        newRow.Id = createdCnae.Id;
        newRow.isEdit = false;
        this.loadCnaeData(this.userId);
        this.sharedService.showSnackBar('Dato de facturación añadido correctamente');
        this.yearCnae.reset()
      },
      error: (err) => {
        // Manejo de error
        console.error('Error al añadir el dato de facturación:', err);
        this.sharedService.showSnackBar('Error al añadir el dato de facturación');
      }
      });
  }

  public editRow(row: CnaeDataDTO) {
    if (row.Id == 0) {
      this.cnaesDataService.createCnaeData(row).subscribe((newObjective: CnaeDataDTO) => {
        row.Id = newObjective.Id
        row.isEdit = false
        row.cnaeUnitSelected = this.currentActivityIndicator,
        this.loadCnaeData( this.userId )
      });
    } else {
      this.cnaesDataService.updateCnaeData(row.Id, row).subscribe(() => {
        row.isEdit = false
        this.loadCnaeData( this.userId )
      })
    }
    row.isEdit = false
  }

  public removeRow(id: any) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.cnaesDataService.deleteCnaeData(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: CnaeDataDTO) => u.Id !== id
    );
  });
  }

  public removeSelectedRows() {
    /* this.dataSource = this.dataSource.filter((u: any) => !u.isSelected); */

    const cnaesData = this.dataSource.data.filter((u: CnaeDataDTO) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.cnaesDataService.deleteCnaesData(cnaesData).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: CnaeDataDTO) => !u.isSelected
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

