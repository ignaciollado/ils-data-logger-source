import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
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
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { MonthService } from 'src/app/Services/month.service';
import { MonthDTO } from 'src/app/Models/month.dto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

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
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
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

export class PersonsComponent {
  minDate: Date;
  maxDate: Date;
  startDate = new Date(new Date().getFullYear(), 0, 1);

  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  energy: UntypedFormControl
  companyId: UntypedFormControl

  numberOfPersons: UntypedFormControl
  monthlyBilling: UntypedFormControl
  fromDate: UntypedFormControl
  toDate: UntypedFormControl
  quantity: UntypedFormControl
  month: UntypedFormControl
  personForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  consumptionFields: string[] = []

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  months!: MonthDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'quantity', 'month'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private monthService: MonthService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private _adapter: DateAdapter<any>,
    
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear , currentMonth, 1);
    this.maxDate = new Date(currentYear, currentMonth, 31);

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.localStorageService.get('user_id');

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '','', '', '', '', 1, 0, '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] );

    this.fromDate = new UntypedFormControl( this.minDate, [ Validators.required ] );
    this.toDate = new UntypedFormControl( this.maxDate, [ Validators.required ] );
    this.month = new UntypedFormControl( '', [ Validators.required ] );

    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
    this.numberOfPersons = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
    this.monthlyBilling = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);

    this.loadDelegations();
    this.loadMonths();

    this.energy = new UntypedFormControl(0);
    this.personForm = this.formBuilder.group({
      delegation: this.delegation,
      fromDateWater: this.fromDate,
      toDateWater: this.toDate,
      quantityWater: this.quantity,
      numberOfPersons: this.numberOfPersons,
      monthlyBilling: this.monthlyBilling,
    })

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

  private loadMonths(): void {
    let errorResponse: any;
      this.monthService.getAllMonths().subscribe(
        (months: MonthDTO[]) => {
          console.log (`---${months}---`)
          this.months = months;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
  }

  private loadConsumption(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {

        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 2).subscribe(
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

  /* ASPECT WATER */
  private createWaterConsumption(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.consumption.companyId = userId;
      this.consumption.aspectId = 2; /* Water aspect id : 2 */
      this.consumptionService.createWaterConsumption(this.consumption)
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
            this.fromDate.reset()
            this.toDate.reset()
            this.quantity.reset()
            this.loadConsumption();
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

  deletePerson(consumptionId: number): void {
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

  savePersonForm(): void {
    this.isValidForm = false;
    if (this.personForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.personForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createWaterConsumption();
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.fromDate.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.fromDate.setValue(ctrlValue);
    datepicker.close();
  }

}
