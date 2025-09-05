import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConsumptionDTO, waterColumns } from 'src/app/Models/consumption.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator  } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { BillingService } from 'src/app/Services/billing.service';
import { CnaeDataService } from 'src/app/Services/cnaeData.service';
import { BillingDTO } from 'src/app/Models/billing.dto';
import { CnaeDataDTO } from 'src/app/Models/cnaeData.dto';
import { YearsDTO } from 'src/app/Models/years.dto';

@Component({
  selector: 'app-water-form',
  templateUrl: './water-form.component.html',
  styleUrls: ['./water-form.component.scss'],
})

export class WaterFormComponent {

  consumption: ConsumptionDTO
  billings!: BillingDTO[];
  cnaesData!: CnaeDataDTO[];
  delegation: UntypedFormControl
  water: UntypedFormControl
  companyId: UntypedFormControl

  yearWater: UntypedFormControl
  objective: UntypedFormControl
  theRatioType: UntypedFormControl

  waterForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  isRatioBilling: boolean = false
  isRatioCNAE: boolean = false
  consumptionFields: string[] = []
  result: boolean = false
  theRatioTypeSelected : boolean = false

  monthYearPattern: string = "^[0-9]{2}\/[0-9]{4}"

  @Input() monthYearDefault: string;
  @Input() delegationDefault: string;


  private isUpdateMode: boolean
  private validRequest: boolean
  private consumptionId: string | null
  private userId: string | null

  delegations!: DelegationDTO[]
  consumptions!: ConsumptionDTO[]
  years: YearsDTO[]

  isGridView: boolean = false
  columnsDisplayed: string[] = waterColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<ConsumptionDTO>()
  columnsSchema: any = waterColumns;

  valid: any = {}

  @ViewChild('waterTbSort') waterTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.waterTbSort;
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

    this.isValidForm = null
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id')
    this.userId = this.jwtHelper.decodeToken().id_ils
    this.consumption = new ConsumptionDTO(0, '', this._adapter.today(), this._adapter.today(), false, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.delegation = new UntypedFormControl( '', [ Validators.required ] )
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] )
    this.yearWater = new UntypedFormControl('', [ Validators.required ]);

    this.water = new UntypedFormControl(0);
    this.waterForm = this.formBuilder.group({
      delegation: this.delegation,
      yearWater: this.yearWater,
    })

    this.loadDelegations(this.userId);
    this.loadConsumption(this.userId);
    this.loadYears()
  }

  private loadBillingProduction(userId: string){
    let errorResponse: any;
    if (this.userId) {
      this.billingService.getBillingsByCompany(userId).subscribe(
        (billings: BillingDTO[]) => {
          this.billings = billings;
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
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );
    }
  }

  private loadDelegations(userId: string): void {
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

  private loadConsumption(userId: string): void {
    let errorResponse: any;
    if (userId) {
        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 2).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource.data = this.consumptions
          this.dataSource.sort = this.waterTbSort;
          this.dataSource.paginator = this.paginator;
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

  /* ASPECT WATER */
  private createWaterConsumption(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.userId) {
      this.consumption.companyId = this.userId;
      this.consumption.aspectId = 2; /* Water aspect id : 2 */
      this.consumptionService.createWaterConsumption(this.consumption)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'postFeedback',
            responseOK,
            errorResponse
          );
        })
      )
      .subscribe(
        () => {
          responseOK = true;
          this.yearWater.reset()
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

  saveWaterForm(): void {
    this.isValidForm = false;
    if (this.waterForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.waterForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createWaterConsumption();
    }

  }


  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: ConsumptionDTO = {
      consumptionId: '0',
      companyId: this.userId,
      delegation: this.delegation.value,
      aspectId: 2,
      year: this.yearWater.value,
      quantity: 0,
      energy: 0,
      residueId: '',
      scopeOne: 0,
      scopeTwo: 0,
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
    if (row.consumptionId === '0') {
      this.consumptionService.createEnergyConsumption(row).subscribe((newConsumption: ConsumptionDTO) => {
        row.consumptionId = newConsumption.consumptionId
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

    const consumptionData = this.dataSource.data.filter((u: ConsumptionDTO) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.consumptionService.deleteConsumptions(consumptionData).subscribe(() => {
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

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
    this.objective.enable()
    this.objective.addValidators(Validators.required)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
