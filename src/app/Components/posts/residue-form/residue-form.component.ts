
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild, Input } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConsumptionDTO, residueColumns } from 'src/app/Models/consumption.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { ResidueService } from 'src/app/Services/residue.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator  } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { Chapter, Subchapter, Item } from 'src/app/Models/residuesRepository.dto';
import { MatSelect } from '@angular/material/select';
import { BillingService } from 'src/app/Services/billing.service';
import { CnaeDataService } from 'src/app/Services/cnaeData.service';
import { BillingDTO } from 'src/app/Models/billing.dto';
import { CnaeDataDTO } from 'src/app/Models/cnaeData.dto';
import { YearsDTO } from 'src/app/Models/years.dto';


@Component({
  selector: 'app-residue-form',
  templateUrl: './residue-form.component.html',
  styleUrls: ['./residue-form.component.scss'],
})

export class ResidueFormComponent {

  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  companyId: UntypedFormControl
  residue: UntypedFormControl
  residueFilter: FormControl<string> = new FormControl<string>('');
  yearResidue: UntypedFormControl
  residueForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  isRatioBilling: boolean = false
  isRatioCNAE: boolean = false
  theRatioTypeSelected: boolean = false
  consumptionFields: string[] = []
  result: boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  isSearching: boolean = false
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[]
  chapters!: Chapter[]
  subchapters: Subchapter[]
  residuesItem: Item[] = []
  consumptions!: ConsumptionDTO[]
  billings!: BillingDTO[]
  cnaesData!: CnaeDataDTO[]
  years: YearsDTO[]

  isGridView: boolean = false
  columnsDisplayed: string[] = residueColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<ConsumptionDTO>();
  columnsSchema: any = residueColumns;
  valid: any = {}

  @ViewChild('residueTbSort') residueTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.residueTbSort;
  }

    /** list of residues filtered by search keyword */
    public filteredResidues: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();
    @Input() searching = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private residueService: ResidueService,
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
    this.delegation = new UntypedFormControl('', [ Validators.required ])
    this.residue = new UntypedFormControl('', [ Validators.required ])
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ])
    this.yearResidue = new UntypedFormControl('', [ Validators.required ])

    this.residueForm = this.formBuilder.group({
      delegation: this.delegation,
      residue: this.residue,
      residueFilter: this.residueFilter,
      yearResidue: this.yearResidue,
    })

    this.loadDelegations();
  }

  ngOnInit() {
    this.loadResidues()
    // listen for search field value changes
    this.residueFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.isSearching = true
        this.filterResidues();
    });

    this.loadConsumption( this.userId )
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

  private loadResidues(): void {
    let errorResponse: any;
    this.residueService.getResiduesLER()
    .subscribe(
      (residues: Item[]) => {
        this.residuesItem = residues
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  private loadConsumption(userId: string): void {
    let errorResponse: any;
    if (this.userId) {
        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 3).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.consumptions.map( (consumption:ConsumptionDTO) => {
           this.residueService.getResiduesLER()
            .subscribe(
              (residues: Item[]) => {
                this.residuesItem = residues;
                this.residuesItem.map( item => {
                      if (item.itemId === consumption.residueId) {
                        consumption.residueES = item.itemName
                      }
                  this.residuesItem
                })
              })

          })
          this.dataSource = new MatTableDataSource(this.consumptions)
          this.dataSource.sort = this.residueTbSort
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

  protected filterResidues() {
    if (!this.residuesItem) {
      return;
    }
    let search = this.residueFilter.value;
    if (search !== "") {
      this.residuesItem = this.residuesItem.filter((item:Item)=> item.itemName.toLowerCase().includes(search.toLowerCase()))
      return;
    } else {
      this.loadResidues()
    }
    this.isSearching = false
    // filter the banks
    this.filteredResidues.next(
      this.residuesItem.filter(bank => bank.itemName.toLowerCase().includes(search))
    );

  }

  private createResidueConsumption(): void {
    let errorResponse: any
    let responseOK: boolean = false
    if (this.userId) {
      this.consumption.companyId = this.userId
      this.consumption.aspectId = 3; /* Residues aspect id : 3 */
      this.consumptionService.createResidueConsumption(this.consumption)
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
            /* this.yearResidue.reset() */
           /*  this.quantityResidue.reset() */
            /* this.residue.reset() */
           /*  this.reuse.reset()
            this.recycling.reset()
            this.incineration.reset()
            this.dump.reset()
            this.compost.reset() */

            this.loadConsumption(this.userId);
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

  private editResidue(): void {

  }

  public saveResidueForm(): void {

    this.isValidForm = false;
    if (this.residueForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.residueForm.value;

    if (this.isUpdateMode) {
      this.editResidue();
    } else {
      this.createResidueConsumption();
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

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
  }

  public addRow() {
    /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
    /*  this.dataSource = [...this.dataSource, newRow];  */

    const newRow: ConsumptionDTO = {
      consumptionId: '0',
      companyId: this.userId,
      delegation: this.delegation.value,
      aspectId: 3,
      residueId: this.residue.value,
      year: this.yearResidue.value,
      quantity: 0,
      energy: this.residue.value,
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
      fromDate: new Date(),
      toDate: new Date(),
      created_at: new Date(),
      objective: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  public editRow(row: ConsumptionDTO) {
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

  public removeRow(element: any) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.consumptionService.deleteConsumption(element.consumptionId).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: ConsumptionDTO) => u.consumptionId !== element.consumptionId
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
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false)
    }
    return false
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
