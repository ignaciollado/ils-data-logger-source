import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PersonDTO } from 'src/app/Models/person.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PersonsService } from 'src/app/Services/persons.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BillingDTO } from 'src/app/Models/billing.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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

  person: PersonDTO
  delegation: UntypedFormControl
  energy: UntypedFormControl
  companyId: UntypedFormControl
  numberOfPersons: UntypedFormControl
  monthlyBilling: UntypedFormControl
  monthYearDate: FormControl
  quantity: UntypedFormControl
  objective: UntypedFormControl
  personForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  consumptionFields: string[] = []

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  persons!: PersonDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'year', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];
  dataSource = new MatTableDataSource(this.persons);

  @ViewChild('personTbSort') personTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.personTbSort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private personService: PersonsService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
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
    this.userId = this.jwtHelper.decodeToken().id_ils;

    this.person = new PersonDTO(0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] );
    this.monthYearDate = new FormControl('', [ Validators.required, Validators.min(1), Validators.max(12) ]);
    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
    this.objective = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);


    this.energy = new UntypedFormControl(0);
    this.personForm = this.formBuilder.group({
      delegation: this.delegation,
      monthYearDate: this.monthYearDate,
      quantity: this.quantity,
      objective: this.objective,

    })

    this.loadDelegations();
    this.loadPersons();
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

  private loadPersons(): void {
    let errorResponse: any;
    if (this.userId) {
        this.personService.getPersonsByCompany(this.userId).subscribe(
        (persons: PersonDTO[]) => {
          this.persons = persons
          this.dataSource = new MatTableDataSource(this.persons)
          this.dataSource.sort = this.personTbSort
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  private createPerson(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.jwtHelper.decodeToken().id_ils;
    if (userId) {
      this.person.companyId = userId;
      
      this.personService.createPerson(this.person)
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
            this.monthYearDate.reset()
            this.quantity.reset()
            this.loadPersons();
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

  deletePerson(personId: number): void {
    let errorResponse: any;
    let result = confirm('Confirm delete this consumption with id: ' + personId + ' .');
    if (result) {
      this.personService.deletePerson(personId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadPersons()
    }
  }

  savePersonForm(): void {
    this.isValidForm = false;
    if (this.personForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.person = this.personForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createPerson();
    }
  }

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

