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
import { BillingDTO } from 'src/app/Models/billing.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { BillingService } from 'src/app/Services/billing.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
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

export class BillingComponent {

  billing: BillingDTO
  billingOBJs: any [] = []
  billingLines: {delegation: string, year: string, quantity: string[]}

  delegation: UntypedFormControl
  companyId: UntypedFormControl
  monthYearDate: UntypedFormControl
  quantity: UntypedFormControl
  objective: UntypedFormControl
  billingForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  billings!: BillingDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'year', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private billingService: BillingService,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService,
    private _adapter: DateAdapter<any>,
    
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this.billingLines = { 
                          "delegation": "",
                          "year": "",
                          "quantity": ['-','-','-','-','-','-','-','-','-','-','-','-']
                        }

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.jwtHelper.decodeToken().id_ils

    this.billing = new BillingDTO (0, 0, 0, '','', 0, 0);
    this.isUpdateMode = false;
    this.validRequest = false;

    this.delegation = new UntypedFormControl( 19, [ Validators.required ] );
    this.companyId = new UntypedFormControl( 284, [ Validators.required ] );
    this.monthYearDate = new UntypedFormControl('', [ Validators.required, Validators.min(1), Validators.max(12) ]);
    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);
    this.objective = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);

    this.billingForm = this.formBuilder.group({
      delegation: this.delegation,
      monthYearDate: this.monthYearDate,
      quantity: this.quantity,
      objective: this.objective,
    })

    this.loadDelegations();
    this.loadBilling();
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

  private loadBilling(): void {
    let errorResponse: any;
    const userId = this.jwtHelper.decodeToken().id_ils;
    
    if (userId) {
      let currentDelegation: string
      let currentYear: string
      let previousDelegation: string
      let previousYear: string

      this.billingService.getAllBillingsByCompanyMock(userId).subscribe(
        (billingsMock: BillingDTO[]) => 
        {
          billingsMock.forEach( (item:BillingDTO) => { 

            currentDelegation = item.companyDelegationId.toString()
            currentYear = item.year

            if ( currentDelegation != previousDelegation ) {
              this.billingLines.delegation = item.companyDelegationId.toString()
            }

            if ( currentYear != previousYear ) {
              this.billingLines.year = item.year.toString()
            }

            this.billingLines.quantity[+item.month-1] = item.quantity +"/"+ item.objective
            this.billingOBJs.push({"delegation": this.billingLines.delegation, "year":this.billingLines.year, "quantity":  this.billingLines.quantity})
          
            this.billingLines = { "delegation": "",
              "year": "",
              "quantity": ['-','-','-','-','-','-','-','-','-','-','-','-']
            }
            
            console.log ( previousDelegation, previousYear, currentDelegation, currentYear)
            previousDelegation = currentDelegation
            previousYear = currentYear
          
          } )
          
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      ); 

    /*    this.billingService.getAllBillingsByCompany(userId).subscribe(
        (billings: BillingDTO[]) => {
          this.billings = billings
          console.log (this.billings)
          } 
        ,
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      ); */

    }
  }

  private createBilling(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.jwtHelper.decodeToken().id_ils;

    if (userId) {
      this.billing.companyId = userId;

      this.billingService.createBilling(this.billing)
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
            this.loadBilling();
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

  deleteBilling(billingId: number): void {
    let errorResponse: any;
    let result = confirm('Confirm delete this billing with id: ' + billingId + ' .');
    if (result) {
      this.billingService.deleteBilling(billingId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {

          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadBilling()
    }
  }

  saveBillingForm(): void {
    this.isValidForm = false;
    if (this.billingForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.billing = this.billingForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createBilling();
    }
  }

}
