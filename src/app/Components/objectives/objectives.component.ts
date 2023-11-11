import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'

import { DelegationService } from 'src/app/Services/delegation.service'
import { DelegationDTO } from 'src/app/Models/delegation.dto'
import { ObjectiveService } from 'src/app/Services/objective.service'
import { ObjectiveColumns, ObjectiveDTO } from 'src/app/Models/objective.dto'
import { EnergyService } from 'src/app/Services/energy.service'
import { EnergyDTO } from 'src/app/Models/energy.dto'

import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpErrorResponse } from '@angular/common/http'
import { SharedService } from 'src/app/Services/shared.service'

import { UserService } from 'src/app/Services/user.service'
import { UserDTO } from 'src/app/Models/user.dto'
import { MatTableDataSource } from '@angular/material/table'

import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component'

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { ResidueDTO } from 'src/app/Models/residue.dto'
import { ResidueService } from 'src/app/Services/residue.service'
import { EnvironmentalDTO } from 'src/app/Models/environmental.dto'

/* const USER_DATA = [
  {id: 1, delegation: "Son Castelló", year: "2019", energyES: "Electricidad (kWh)", "objectiveType": "Billing", "jan": 1.50},
  {id: 2, delegation: "Can Valero", year: "2020", energyES: "Fuel (kg)", "objectiveType": "Billing", "jan": .300},
  {id: 3, delegation: "Son Castelló", year: "2019", energyES: "Gas butano (kg)", "objectiveType": "Activity indicator: Tonelada*", "feb": 1.4579},
  {id: 4, delegation: "Son Castelló", year: "2020", energyES: "Gas Natural (kWh)", "objectiveType": "Activity indicator:  Tonelada*", "jan": 1.2550}
]; */

/* const COLUMNS_SCHEMA = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
      key: "delegation",
      type: "text",
      label: "Emplaçament"
  },
  {
      key: "year",
      type: "text",
      label: "Year"
  },
  {
      key: "enviromental",
      type: "number",
      label: "Enviromental"
  },
  {
      key: "enero",
      type: "number",
      label: "January"
  },
  {
    key: "febrero",
    type: "number",
    label: "February"
  },
  {
    key: "marzo",
    type: "number",
    label: "March"
  },
  {
    key: "abril",
    type: "number",
    label: "April"
  },
  {
    key: "mayo",
    type: "number",
    label: "May"
  },
  {
    key: "junio",
    type: "number",
    label: "June"
  },
  {
    key: "julio",
    type: "number",
    label: "July"
  },
  {
    key: "agosto",
    type: "number",
    label: "August"
  },
  {
    key: "setiembre",
    type: "number",
    label: "September"
  },
  {
    key: "octubre",
    type: "number",
    label: "October"
  },
  {
    key: "noviembre",
    type: "number",
    label: "November"
  },
  {
    key: "diciembre",
    type: "number",
    label: "December"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  },

] */

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})

export class ObjectivesComponent {

  delegation: UntypedFormControl
  environmentalData: UntypedFormControl
  companyId: UntypedFormControl

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

  objectiveForm: UntypedFormGroup
  delegations!: DelegationDTO[]
  objectives!: ObjectiveDTO[]
  energies!: EnergyDTO[]
  residues!: ResidueDTO[]
  environmentalDataList: EnvironmentalDTO[] = []
  yearObjective: UntypedFormControl
  objectiveType: UntypedFormControl
  userFields: string[] = []

  private userId: string | null
  currentActivityIndicator: string = "Not selected"

  isGridView: boolean = false
  columnsDisplayed : string[] = ObjectiveColumns.map((col) => col.key);
  /* dataSource: any = USER_DATA; */
  columnsSchema: any = ObjectiveColumns;
  /* dataSource = new MatTableDataSource(this.consumptions) */
  dataSource = new MatTableDataSource<ObjectiveDTO>()

  constructor (
    private delegationService: DelegationService,
    private jwtHelper: JwtHelperService,
    private sharedService: SharedService,
    private energyService: EnergyService,
    private residueService: ResidueService,
    private objectiveService: ObjectiveService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
    private _adapter: DateAdapter<any>,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;
    this.environmentalData = new UntypedFormControl('', [ Validators.required ])
    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] );
    this.yearObjective = new UntypedFormControl('', [ Validators.required ]);
    this.objectiveType = new UntypedFormControl('', [ Validators.required ]);

/*     this.genCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.febCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.marCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.aprCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.mayCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.junCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.julCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.augCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.sepCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.octCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.novCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.decCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ]) */

/*     this.genBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.febBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.marBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.aprBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.mayBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.junBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.julBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.augBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.sepBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.octBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.novBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.decBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ]) */

    this.objectiveForm = this.formBuilder.group({
      delegation: this.delegation,
      enviromentalData: this.environmentalData,
      yearObjective: this.yearObjective,
      objectiveType: this.objectiveType,
     /*  genCnae: this.genCnae,
      genBill: this.genBill,
      febCnae: this.febCnae,
      febBill: this.febBill,
      marCnae: this.marCnae,
      marBill: this.marBill,
      aprCnae: this.aprCnae,
      aprBill: this.aprBill,
      mayCnae: this.mayCnae,
      mayBill: this.mayBill,
      junCnae: this.junCnae,
      junBill: this.junBill,
      julCnae: this.julCnae,
      julBill: this.julBill,
      augCnae: this.augCnae,
      augBill: this.augBill,
      sepCnae: this.sepCnae,
      sepBill: this.sepBill,
      octCnae: this.octCnae,
      octBill: this.octBill,
      novCnae: this.novCnae,
      novBill: this.novBill,
      decCnae: this.decCnae,
      decBill: this.decBill, */
    })

    this.loadDelegations()
    this.loadEnergies()
    this.getCurrentIndicator( this.userId )
  }

  ngOnInit() {
    this.loadObjectives( this.userId )
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
  private loadEnergies(): void {
    let errorResponse: any;
    if (this.userId) {
      this.energyService.getAllEnergies().subscribe(
        (energies: EnergyDTO[]) => {
          energies.map( item => {
            this.environmentalDataList = [...this.environmentalDataList, {idEnv:item.energyId, nameES: item.nameES, nameCA: item.nameCA, aspectId: item.aspectId}]
          });
          this.loadResidues()
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
    if (this.userId) {
      this.residueService.getAllResidues().subscribe(
        (residues: ResidueDTO[]) => {
          residues.map( item => {
            this.environmentalDataList = [...this.environmentalDataList, {idEnv:item.residueId, nameES: item.nameES, nameCA: item.nameCA, aspectId: 3}]
        });
        this.environmentalDataList = [...this.environmentalDataList, {idEnv:"98", nameES: "Water (L)", nameCA: "Water (L)", aspectId: 2}]
        this.environmentalDataList = [...this.environmentalDataList, {idEnv:"99", nameES: "Emisiones de CO2e (T)", nameCA: "Emisiones de CO2e (T)", aspectId: 5}]
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadObjectives( userId: string ): void {
    this.objectiveService.getAllObjectivesByCompany(this.userId).subscribe((res: any) => {
      this.dataSource.data = res;
    });
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
   /*  const newRow = {"delegation": this.delegation.value, "year": this.yearObjective.value, "energyES": this.energy.value, "objectiveType": this.objectiveType.value, isEdit: true} */
   /*  this.dataSource = [...this.dataSource, newRow];  */
   const newRow: ObjectiveDTO = {
    id: 0,
    companyId: this.userId,
    companyDelegationId: this.delegation.value,
    delegation: '',
    aspectId: this.environmentalData.value,
    theRatioType: this.currentActivityIndicator,
    energy: 0,
    residueId: 0,
    energyES: '',
    energyCA: '',
    residueES: '',
    residueCA: '',
    aspectES: '',
    aspectCA: '',
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
  this.dataSource.data = [newRow, ...this.dataSource.data];
  }
  editRow(row: ObjectiveDTO) {
    console.log (row)
    if (row.id === 0) {
      this.objectiveService.createObjective(row).subscribe((newUser: ObjectiveDTO) => {
        row.id = newUser.id;
        row.isEdit = false;
      });
    } else {
      this.objectiveService.updateObjective(row.id, row).subscribe(() => (row.isEdit = false));
    }
   /*  this.objectiveService.updateObjective(row.id, row).subscribe(() => row.isEdit = false); */
  }
  public removeRow(id: number) {
   /*  this.dataSource = this.dataSource.filter((u:any) => u.id !== id); */
   this.objectiveService.deleteObjective(id).subscribe(() => {
    this.dataSource.data = this.dataSource.data.filter(
      (u: ObjectiveDTO) => u.id !== id
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
