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

const CNAES_DATA = [
  {Id: 1, delegation: "Son Castelló", year: "2019", enviromentalDataName: "Fuel (kg)", "cnaeUnitSelected": "Billing", "jan": 15000000, "feb": 15000000, "mar": 15000000, "apr": 15000000, "may": 15000000
  , "jun": 15000000, "jul": 15000000, "aug": 15000000, "sep": 15000000, "oct": 15000000, "nov": 15000000, "dec": 15000000},
  {Id: 2, delegation: "Can Valero", year: "2020", enviromentalDataName: "Fuel (kg)", "cnaeUnitSelected": "Billing", "jan": .300},
  {Id: 3, delegation: "Son Castelló", year: "2019", enviromentalDataName: "Gas butano (kg)", "cnaeUnitSelected": "Tonelada*", "jan": 500.57, "feb": 1.4579},
  {Id: 4, delegation: "Son Castelló", year: "2020", enviromentalDataName: "Gas Natural (kWh)", "cnaeUnitSelected": "Tonelada*", "jan": 1.2550}
];

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

  isGridView: boolean = false
  columnsDisplayed: string[] = CnaeColumns.map((col) => col.key)
  //dataSource: any = CNAES_DATA
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

  private getCurrentIndicator( companyId: string ){
    let errorResponse: any;
    if (this.userId) {
      this.userService.getUSerByIdMySQL(this.userId).subscribe(
        (userData: UserDTO) => {
          this.userFields = Object.entries(userData).map( item => item[1])
          this.currentActivityIndicator =  JSON.parse(JSON.stringify(this.userFields[7]));
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: CnaeDataDTO = {
      Id: 0,
      companyId: +this.userId,
      companyDelegationId: this.delegation.value,
      cnaeUnitSelected: this.currentActivityIndicator,
      year: this.yearCnae.value,
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: CnaeDataDTO) {
    if (row.Id == 0) {
      this.cnaesDataService.createCnaeData(row).subscribe((newObjective: CnaeDataDTO) => {
        row.Id = newObjective.Id
        row.isEdit = false
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

