
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { 
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { ResidueService } from 'src/app/Services/residue.service';

/* import { MonthDTO } from 'src/app/Models/month.dto'; */
/* import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker'; */
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

/* export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}; */

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
  reuse: UntypedFormControl
  recycling: UntypedFormControl
  incineration: UntypedFormControl
  dump: UntypedFormControl
  compost: UntypedFormControl
  monthYearDate: UntypedFormControl

  quantityResidue: UntypedFormControl
  theRatioType: UntypedFormControl
  objective: UntypedFormControl

  residueForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  theRatioTypeSelected: boolean = false
  consumptionFields: string[] = []
  result: boolean = false
  monthYearPattern: string = "^[0-9]{2}\/[0-9]{4}"

  @Input() monthYearDefault: string;
  @Input() delegationDefault: string;


  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  residues!: ResidueDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'year', 'residue', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];
  dataSource = new MatTableDataSource(this.consumptions);

  @ViewChild('residueTbSort') residueTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.residueTbSort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private residueService: ResidueService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ])
    this.residue = new UntypedFormControl('', [ Validators.required ])
    this.reuse = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ])
    this.recycling = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ])
    this.incineration = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ])
    this.dump = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ])
    this.compost = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ])
    this.quantityResidue = new UntypedFormControl('', [ Validators.required, Validators.min(0)])
    this.theRatioType = new UntypedFormControl({value: '', disabled: false})
    this.objective = new UntypedFormControl({value: '', disabled: true}, [ Validators.min(1) ])
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ])
    this.monthYearDate = new UntypedFormControl('', [ Validators.required, Validators.min(1), Validators.max(12), Validators.pattern(this.monthYearPattern) ])

    this.residueForm = this.formBuilder.group({

      delegation: this.delegation,
      residue: this.residue,
      reuse: this.reuse,
      recycling: this.recycling,
      incineration: this.incineration,
      dump: this.dump,
      compost: this.compost,
      monthYearDate: this.monthYearDate,
      quantityResidue: this.quantityResidue,
      objective: this.objective,
      theRatioType: this.theRatioType

    })

    this.loadDelegations();
    this.loadResidues();
    this.loadConsumption();
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
    if (this.userId) {
      this.residueService.getAllResidues().subscribe(
        (residues: ResidueDTO[]) => {
          this.residues = residues;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadConsumption(): void {
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
            /* this.monthYearDate.reset() */
            this.quantityResidue.reset()
            /* this.residue.reset() */
            this.reuse.reset()
            this.recycling.reset()
            this.incineration.reset()
            this.dump.reset()
            this.compost.reset()

            this.loadConsumption();
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

  deleteResidue(consumptionId: number): void {

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
      this.loadConsumption()
    }
  }


  saveResidueForm(): void {

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

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public ratioTypeSelected(ratioType: any) {
    console.log(ratioType)
    this.theRatioTypeSelected = !this.theRatioTypeSelected
    this.objective.enable()
    this.objective.addValidators(Validators.required)
  }

}
