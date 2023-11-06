import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
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
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  monthYearDate: UntypedFormControl
  energy: UntypedFormControl
  quantity: UntypedFormControl
  companyId: UntypedFormControl
  energyForm: UntypedFormGroup
  objective: UntypedFormControl
  theRatioType: UntypedFormControl

  isValidForm: boolean | null
  isElevated: boolean = true
  consumptionFields: string[] = []
  result : boolean = false
  theRatioTypeSelected : boolean = false

  monthYearPattern: string = "^[0-9]{2}\/[0-9]{4}"

  showButtons: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  absoluteData: boolean = true;
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
  columnsDisplayed = ['delegation', 'year', 'energy', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre', 'ACTIONS'];
  dataSource = new MatTableDataSource(this.consumptions);

  @ViewChild('energyTbSort') energyTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.energyTbSort;
  }

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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.monthYearDate = new UntypedFormControl('', [ Validators.required, Validators.min(1), Validators.max(12), Validators.pattern(this.monthYearPattern) ]);

    this.energy = new UntypedFormControl('', [ Validators.required ])
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ])
    this.quantity = new UntypedFormControl('', [ Validators.required, Validators.min(1) ])
    this.objective = new UntypedFormControl({value: '', disabled: true}, [ Validators.min(1) ])
    this.theRatioType = new UntypedFormControl({value: '', disabled: false})

    this.energyForm = this.formBuilder.group({
      delegation: this.delegation,
      monthYearDate: this.monthYearDate,
      energy: this.energy,
      quantity: this.quantity,
      objective: this.objective,
      companyId: this.companyId,
      theRatioType: this.theRatioType
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
          this.dataSource = new MatTableDataSource(this.consumptions);
          this.dataSource.sort = this.energyTbSort;
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

  /* ASPECT ENERGY ID:1*/
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
            /* this.energy.reset() */
            console.log (this.monthYearDate.value, this.monthYearDate.value.substring(-4))
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

  public deleteEnergyConsumption(consumptionId: number): void {
    let errorResponse: any;

    this.result = confirm('Confirm delete this energy');
    if (this.result) {
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

  public saveForm(): void {

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

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public absoluteRelativeToggle(): void {
    this.absoluteData = !this.absoluteData
    console.log(this.absoluteData)
  }

  public ratioTypeSelected(ratioType: any) {
      console.log(ratioType)
      this.theRatioTypeSelected = !this.theRatioTypeSelected
      this.objective.enable()
      this.objective.addValidators(Validators.required)
  }
}
