import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ConsumptionDTO, energyColumns } from 'src/app/Models/consumption.dto';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { EnergyService } from 'src/app/Services/energy.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';

import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { MatPaginator } from '@angular/material/paginator';

const ENERGIES_DATA = [
  {Id: 1, delegation: "Mock data", year: "2019", energyES: "Fuel (kg)", "jan": 15000000, "feb": 15000000, "mar": 15000000, "apr": 15000000, "may": 15000000
  , "jun": 15000000, "jul": 15000000, "aug": 15000000, "sep": 15000000, "oct": 15000000, "nov": 15000000, "dec": 15000000},
  {Id: 2, delegation: "Mock data", year: "2020", energyES: "Fuel (kg)", "jan": .300},
  {Id: 3, delegation: "Mock data", year: "2019", energyES: "Gas butano (kg)", "jan": 500.57, "feb": 1.4579},
  {Id: 4, delegation: "Mock data", year: "2020", energyES: "Gas Natural (kWh)", "jan": 1.2550}
];
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})

export class PostFormComponent implements OnInit {

  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  yearEnergy: UntypedFormControl
  energy: UntypedFormControl
  quantity: UntypedFormControl
  companyId: UntypedFormControl
  energyForm: UntypedFormGroup
  objective: UntypedFormControl
  theRatioType: UntypedFormControl

  isValidForm: boolean | null
  isElevated: boolean = true
  consumptionFields: string[] = []
  result : boolean = false
  theRatioTypeSelected : boolean = false

  monthYearPattern: string = "^[0-9]{2}\/[0-9]{4}"

  showButtons: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  absoluteData: boolean = true;
  access_token: string | null;
  today: Date
  sixMonthsAgo: Date

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  energies!: EnergyDTO[];
  delegations!: DelegationDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed: string[] = energyColumns.map((col) => col.key);
  //dataSource: any = ENERGIES_DATA
  dataSource = new MatTableDataSource<ConsumptionDTO>()
  columnsSchema: any = energyColumns;

  valid: any = {}
/*   columnsDisplayed = ['delegation', 'year', 'energy', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];
  ; */

  @ViewChild('energyTbSort') energyTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.energyTbSort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private energyService: EnergyService,
    private jwtHelper: JwtHelperService,
    private _adapter: DateAdapter<any>,
    public dialog: MatDialog,

    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    this.showButtons = false
    this.access_token = sessionStorage.getItem("access_token")
    this.showAuthSection = false
    this.showNoAuthSection = true

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, }
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, }
        this.headerMenusService.headerManagement.next(headerInfo)
      } else {
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo)
        this.router.navigateByUrl('login')
      }
    }

    this._locale = 'es-ES'
    this._adapter.setLocale(this._locale)

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id')
    this.userId = this.jwtHelper.decodeToken().id_ils

   /*  this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', 0); */
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.yearEnergy = new UntypedFormControl('', [ Validators.required ]);

    this.energy = new UntypedFormControl('', [ Validators.required ])
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ])
    this.theRatioType = new UntypedFormControl({value: '', disabled: false})

    this.energyForm = this.formBuilder.group({
      delegation: this.delegation,
      yearEnergy: this.yearEnergy,
      energy: this.energy,
      companyId: this.companyId,
    });

    this.loadEnergies();
    this.loadDelegations(this.userId);
    this.loadConsumption(this.userId);
  }

  ngOnInit(): void {
    let errorResponse: any;
    // update
    if (this.consumptionId) {
      this.isUpdateMode = true;

      this.consumptionService.getConsumptionsById(this.consumptionId).subscribe(
        (consumption: ConsumptionDTO) => {

          this.consumption = consumption;
          this.consumptionFields = Object.entries(consumption).map( item => item[1])

          this.yearEnergy.setValue(formatDate(this.consumptionFields[4], 'YYYY', 'en'))
          this.energy.setValue(this.consumptionFields[3])
          this.quantity.setValue(this.consumptionFields[2])
          this.companyId.setValue(this.consumptionFields[1])

          this.energyForm = this.formBuilder.group({
            yearEnergy: this.yearEnergy,
            energy: this.energy,
            quantity: this.quantity,
            companyId: this.companyId
          });
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadEnergies(): void {
    let errorResponse: any;
    if (this.userId) {
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

  private loadDelegations(userId: string): void {
    let errorResponse: any;
    if (userId) {
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

  private loadConsumption(userId: string): void {
    let errorResponse: any;

    if (this.userId) {

        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 1).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource = new MatTableDataSource(this.consumptions);
          this.dataSource.sort = this.energyTbSort;
          this.dataSource.paginator = this.paginator;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  private editPost(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.consumptionId) {
      if (this.userId) {
        this.consumption.companyId = this.userId;
        this.consumptionService.updateConsumptions(this.consumptionId, this.consumption)
          .pipe(
            finalize(async () => {
              await this.sharedService.managementToast(
                'postFeedback',
                responseOK,
                errorResponse
              );

              if (responseOK) {
                this.router.navigateByUrl('posts');
              }
            })
          )
          .subscribe(
            () => {
              responseOK = true;
            },
            (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse);
            }
          );
      }
    }
  }

  /* ASPECT ENERGY ID:1*/
  private createEnergyConsumption(): void {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.userId) {
      this.consumption.companyId = this.userId;
      this.consumption.aspectId = 1; /* Energy aspect id : 1 */
      this.consumptionService.createEnergyConsumption(this.consumption)
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
            this.energy.reset()
            /* this.yearEnergy.reset() */
            this.loadConsumption(this.userId);
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

 /*  public deleteEnergyConsumption(consumptionId: number): void {
    let errorResponse: any;
    let responseOK: boolean = false;

      this.consumptionService.deleteConsumption(consumptionId)
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
            this.loadConsumption(this.userId);
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
  } */

  public saveForm(): void {

    this.isValidForm = false;
    if (this.energyForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.energyForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createEnergyConsumption();
    }

  }

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public absoluteRelativeToggle(): void {
    this.absoluteData = !this.absoluteData
    console.log(this.absoluteData)
  }

  public ratioTypeSelected(ratioType: any) {
      console.log(ratioType)
      this.theRatioTypeSelected = !this.theRatioTypeSelected
      this.objective.enable()
      this.objective.addValidators(Validators.required)
  }

  public addRow() {

    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: ConsumptionDTO = {
      consumptionId: '0',
      companyId: this.userId,
      delegation: this.delegation.value,
      aspectId: 1,
      year: this.yearEnergy.value,
      /* jan: '0',
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
      dec: '0', */
      quantity: 0,
      energy: this.energy.value,
      residueId: 0,
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

}
