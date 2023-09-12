import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { EnergyService } from 'src/app/Services/energy.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/consumption.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
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
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

export class PostFormComponent implements OnInit {

  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  monthYearDate: FormControl
  energy: UntypedFormControl
  quantity: UntypedFormControl
  companyId: UntypedFormControl
  energyForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  consumptionFields: string[] = []

  showButtons: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;
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
  columnsDisplayed = ['delegation', 'energy', 'year', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];

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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '','', '', '', '', 1, 0, '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.monthYearDate = new FormControl('', [ Validators.required, Validators.min(7), Validators.max(7) ]);

    this.energy = new UntypedFormControl('', [ Validators.required ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1) ]);

    this.energyForm = this.formBuilder.group({
      delegation: this.delegation,
      monthYearDate: this.monthYearDate,
      energy: this.energy,
      quantity: this.quantity,
      companyId: this.companyId
    });

    this.loadEnergies();
    this.loadDelegations();
    this.loadConsumption();

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

          this.monthYearDate.setValue(formatDate(this.consumptionFields[4], 'YYYY/MM', 'en'))
          this.energy.setValue(this.consumptionFields[3])
          this.quantity.setValue(this.consumptionFields[2])
          this.companyId.setValue(this.consumptionFields[1])

          this.energyForm = this.formBuilder.group({
            monthYearDate: this.monthYearDate,
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

  private loadConsumption(): void {
    let errorResponse: any;
    
    if (this.userId) {
      
        this.consumptionService.getAllConsumptionsByCompanyAndAspect(this.userId, 1).subscribe(
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

  /* ASPECT ENERGY */
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
            this.monthYearDate.reset()
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

  deleteEnergyConsumption(consumptionId: number): void {
    let errorResponse: any;

    let result = confirm('Confirm delete this activity with id: ' + consumptionId + ' .');
    if (result) {
      this.consumptionService.deleteConsumption(consumptionId).subscribe (
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

  saveForm(): void {

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

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {

    const ctrlValue = this.monthYearDate.value!
/*     ctrlValue.month(normalizedMonthAndYear.getMonth()+1)
    ctrlValue.year(normalizedMonthAndYear.getFullYear()) */
    this.monthYearDate.setValue( (normalizedMonthAndYear.getMonth()+1)+"/"+ normalizedMonthAndYear.getFullYear())
    datepicker.close()
  }

}
