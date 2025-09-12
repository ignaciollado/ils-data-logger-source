import { Component, ViewChild } from '@angular/core'
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'

import { IlsService } from 'src/app/Services/ils.service'
import { DelegationService } from 'src/app/Services/delegation.service'
import { DelegationDTO } from 'src/app/Models/delegation.dto'
import { ObjectiveService } from 'src/app/Services/objective.service'
import { ObjectiveColumns, ObjectiveDTO } from 'src/app/Models/objective.dto'
import { EnergyDTO } from 'src/app/Models/energy.dto'

import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpErrorResponse } from '@angular/common/http'
import { SharedService } from 'src/app/Services/shared.service'

import { UserService } from 'src/app/Services/user.service'
import { UserDTO } from 'src/app/Models/user.dto'

import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'

import { ChapterItem, ResidueLERDTO } from 'src/app/Models/residueLER.dto'
import { ReplaySubject, Subject, takeUntil } from 'rxjs'
import { MatSelect } from '@angular/material/select'
import { ResidueService } from 'src/app/Services/residue.service'
import { YearsDTO } from 'src/app/Models/years.dto'
import { IlsCnaeActivityEmissionIndicatorService } from 'src/app/Services/ils-cnae-activity-emission-inidicator.service'

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})

export class ObjectivesComponent {
  isLoading: boolean = true
  delegation: UntypedFormControl
  environmentalData: UntypedFormControl
  companyId: UntypedFormControl

  objectiveForm: UntypedFormGroup
  delegations!: DelegationDTO[]
  objectives!: ObjectiveDTO[]
  energies!: EnergyDTO[]
  residues!: ResidueLERDTO[]
  residuesItem: ChapterItem[] = []
  years: YearsDTO[]

  residueFilter: FormControl<string> = new FormControl<string>('');
  environmentalDataList: any[] = []
  yearObjective: UntypedFormControl
  objectiveType: UntypedFormControl
  userFields: string[] = []

  private userId: string | null
  public isSearching: boolean = false
  currentActivityIndicator: string = "Not selected"

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isGridView: boolean = false
  columnsDisplayed : string[] = ObjectiveColumns.map((col) => col.key)
  dataSource = new MatTableDataSource<ObjectiveDTO>()
  columnsSchema: any = ObjectiveColumns
  valid: any = {}

  checked = false;
  disabled = false;
  isChecked = false;

   /** list of residues filtered by search keyword */
   public filteredResidues: ReplaySubject<ChapterItem[]> = new ReplaySubject<ChapterItem[]>(1);

   @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

  constructor (
    private delegationService: DelegationService,
    private jwtHelper: JwtHelperService,
    private sharedService: SharedService,
    private objectiveService: ObjectiveService,
    private ilsService: IlsService,
    private ilsCnaeService: IlsCnaeActivityEmissionIndicatorService,
    private residueService: ResidueService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    public dialog: MatDialog,

  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
    this.environmentalData = new UntypedFormControl('', [ Validators.required ])
    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] );
    this.yearObjective = new UntypedFormControl('', [ Validators.required ]);
    this.objectiveType = new UntypedFormControl('', [ Validators.required ]);

    this.objectiveForm = this.formBuilder.group({
      delegation: this.delegation,
      enviromentalData: this.environmentalData,
      yearObjective: this.yearObjective,
      objectiveType: this.objectiveType,
    })

    this.loadDelegations()
    this.getCurrentIndicator( this.userId )
  }

  ngOnInit() {
    this.loadEnvironmentalData()
    this.residueFilter.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.isSearching = true
      this.filterResidues();
  });
    this.loadObjectives( this.userId )
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

  private loadObjectives ( userId: string ): void {
    this.ilsService.getById('ils_objective', +userId)
      .subscribe((res: ObjectiveDTO[]) => {
        this.dataSource.data = res
        this.isLoading = false
        this.dataSource.data. map ( (objective: ObjectiveDTO) => {

        if (objective.aspectId == 1) { // Energies
          this.ilsService.getAll('ils_energy')
            .subscribe((energies: EnergyDTO[]) => {
              energies.map ( (itemEnergy: EnergyDTO) => {
              if (itemEnergy.energyId === objective.chapterItemId) {
                objective.enviromentalDataName = itemEnergy.nameES
              }
            })
            })
        }

        if (objective.aspectId == 3) { // Residues
          this.residueService.getResiduesItemsLERById(objective.chapterItemId).subscribe((residueItem:any) => {
            objective.enviromentalDataName = residueItem.chapterItemName
          })
        }

      })
      })
  }

  private loadEnvironmentalData(): void {
    this.objectiveService.getAllEnvironmentalData().subscribe((res: any) => {
      this.environmentalDataList = res
      this.addResiduesList()
    });
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
          this.ilsCnaeService.getAll()
            .subscribe((cnaeItems:any) => {
              cnaeItems.filter((cnae:any) => {
                if (cnae.cnaeCode === userData.cnae) {
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

  public copyCnaeMonthValue( resource: ObjectiveDTO ) {
    if (this.isChecked) {
      resource.dec = resource.nov = resource.oct = resource.sep = resource.aug = resource.jul = resource.jun = resource.may = resource.apr = resource.mar = resource.feb = resource.jan
    } else {
      resource.dec = resource.nov = resource.oct = resource.sep = resource.aug = resource.jul = resource.jun = resource.may = resource.apr = resource.mar = resource.feb = null
    }
    this.isChecked = false
  }

  public deleteObjective( objectiveId: string) {

  }

  public addRow() {
    let environmentalDataEnergy: string = '0'
    if (this.environmentalData.value.aspect == 1) {
      environmentalDataEnergy = this.environmentalData.value.chapterItemId
    }
    if (this.environmentalData.value.aspect == 2) {
      environmentalDataEnergy = '999999'
    }
    if (this.environmentalData.value.aspect == 3) {
      environmentalDataEnergy = this.environmentalData.value.chapterItemId
    }
    if (this.environmentalData.value.aspect == 5) {
      environmentalDataEnergy = '888888'
    }
    const newRow: ObjectiveDTO = {
      id: 0,
      companyId: this.userId,
      companyDelegationId: this.delegation.value,
      aspectId: this.environmentalData.value.aspect,
      theRatioType: this.objectiveType.value,
      chapterItemId: this.environmentalData.value.chapterItemId,
      year: this.yearObjective.value,
      isEdit: true,
      isSelected: false,
    };
    this.objectiveService.createObjective(newRow).subscribe((newObjective: ObjectiveDTO) => {
        newRow.id = newObjective.id
        newRow.isEdit = false
        this.loadObjectives( this.userId )
      });
  }

  editRow(row: ObjectiveDTO) {
    if (row.id == 0) {
      this.objectiveService.createObjective(row).subscribe((newObjective: ObjectiveDTO) => {
        row.id = newObjective.id
        row.isEdit = false
        this.loadObjectives( this.userId )
      });
    } else {
      this.objectiveService.updateObjective(row.id, row).subscribe(() => {
        row.isEdit = false
        this.loadObjectives( this.userId )
      })
    }
    row.isEdit = false
  }

  public removeRow(id: any) {
   this.objectiveService.deleteObjective(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: ObjectiveDTO) => u.id !== id
    );
  });
  }

  public removeSelectedRows() {
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

  private addResiduesList(): void {
    let errorResponse: any;
    this.residueService.getResiduesLER()
    .subscribe(
      (residues: any[]) => {
        this.residues = residues
        this.residues.map( item => { 
          this.environmentalDataList = [...this.environmentalDataList, item]
        }) 

      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    )
  }

  protected filterResidues() {
    if (!this.environmentalDataList) {
      return;
    }
    let search = this.residueFilter.value;
    if (search !== "") {
      this.environmentalDataList = this.environmentalDataList.filter((item:ChapterItem)=> item.chapterItemName.toLowerCase().includes(search.toLowerCase()))
      return;
    } else {
      this.loadEnvironmentalData()
    }
    this.isSearching = false
    // filter the banks
    this.filteredResidues.next(
      this.environmentalDataList.filter(bank => bank.chapterItemName.toLowerCase().includes(search))
    );

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
