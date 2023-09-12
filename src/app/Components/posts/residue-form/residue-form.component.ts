
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl,
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
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { ResidueService } from 'src/app/Services/residue.service';
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { MonthService } from 'src/app/Services/month.service';
import { MonthDTO } from 'src/app/Models/month.dto';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  monthYearDate: FormControl

  quantityResidue: UntypedFormControl
  residueForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  consumptionFields: string[] = []

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  months!: MonthDTO[];
  residues!: ResidueDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'residue', 'year', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private monthService: MonthService,
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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '','', '', '', '', 1, 0, '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.residue = new UntypedFormControl('', [ Validators.required ]);
    this.reuse = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ]);
    this.recycling = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ]);
    this.incineration = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ]);
    this.dump = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ]);
    this.compost = new UntypedFormControl('', [ Validators.min(0), Validators.max(100) ]);
    this.quantityResidue = new UntypedFormControl('', [ Validators.required, Validators.min(0) ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.monthYearDate = new FormControl('', [ Validators.required ]);

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
    const userId = this.jwtHelper.decodeToken().id_ils;
    if (userId) {

        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 3).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
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
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.consumption.companyId = userId;
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
            /* this.delegation.reset() */
           /*  this.fromDateResidue.reset()
            this.toDateResidue.reset() */
            this.quantityResidue.reset()
            this.residue.reset()
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
    let result = confirm('Confirm delete this consumption with id: ' + consumptionId + ' .');
    if (result) {
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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthYearDate.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.monthYearDate.setValue(ctrlValue);
    datepicker.close();
  }

}
