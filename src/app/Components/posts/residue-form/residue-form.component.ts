
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { ResidueService } from 'src/app/Services/residue.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'
import { ResidueLERDTO } from 'src/app/Models/residueLER.dto';
import { MatSelect } from '@angular/material/select';

const RESIDUES_DATA = [
  {Id: 1, delegation: "Son Castelló", year: "2019", residueES: "Combustión no peligrosos (kg)", "jan": 15000000, "feb": 15000000, "mar": 15000000, "apr": 15000000, "may": 15000000
  , "jun": 15000000, "jul": 15000000, "aug": 15000000, "sep": 15000000, "oct": 15000000, "nov": 15000000, "dec": 15000000},
  {Id: 2, delegation: "Can Valero", year: "2020", residueES: "Construcción y demolición (obra) (kg)", "jan": .300},
  {Id: 3, delegation: "Son Castelló", year: "2019", residueES: "Productos alimentarios (kg)", "jan": 500.57, "feb": 1.4579},
  {Id: 4, delegation: "Son Castelló", year: "2020", residueES: "Urbano Mezclado (kg)", "jan": 1.2550}
];

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
  theRatioTypeSelected: boolean = false
  consumptionFields: string[] = []
  result: boolean = false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  residues!: ResidueLERDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed: string[] = residueColumns.map((col) => col.key);
  //dataSource: any = RESIDUES_DATA
  dataSource = new MatTableDataSource<ConsumptionDTO>();
  columnsSchema: any = residueColumns;
  /* columnsDisplayed = ['delegation', 'year', 'residue', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS']; */
  valid: any = {}

  @ViewChild('residueTbSort') residueTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.residueTbSort;
  }

    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<ResidueLERDTO[]> = new ReplaySubject<ResidueLERDTO[]>(1);

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

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
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', 0, '', '', 0);
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
    this.loadResidues();
  }

  ngOnInit() {
    // load the initial bank list
    /* this.filteredBanks.next(this.residues.slice()); */

    // listen for search field value changes
    this.residueFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
    });

    this.loadConsumption( this.userId )
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
      (residues: ResidueLERDTO[]) => {
        this.residues = residues;
        this.filteredBanks.next(this.residues.slice());
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

        this.consumptionService.getAllConsumptionsByCompanyAndAspect(this.userId, 3).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource = new MatTableDataSource(this.consumptions)
          this.dataSource.sort = this.residueTbSort
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  protected filterBanks() {
     this.residues.map( item => {
      item.chapters.map( subItem=> {
        subItem.chapterItems.map( subSubItem=> {
          console.log(subSubItem.chapterItemName)
        })
      })
    }) 

    if (!this.residues.map( item => {
      item.chapters.map( subItem=> {
        subItem.chapterItems.map( subSubItem=> {
          subSubItem.chapterItemName
        })
      })
    })) {
      return;
    }
    // get the search keyword
    let search = this.residueFilter.value;
    console.log (search)
    if (!search) {
      this.filteredBanks.next(this.residues.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.residues.filter(bank => bank.chapterTitle.toLowerCase().indexOf(search) > -1)
    );


  }

  private createResidueConsumption(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.userId) {
      this.consumption.companyId = this.userId;
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

 /*  deleteResidue(consumptionId: number): void {

    let errorResponse: any;
    this.result = confirm('Confirm delete this residue.');
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

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
    /* this.objective.enable()
    this.objective.addValidators(Validators.required) */
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

}
