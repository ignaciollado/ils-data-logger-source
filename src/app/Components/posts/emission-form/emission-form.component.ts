import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { ConsumptionService } from 'src/app/Services/consumption.service';
import { SharedService } from 'src/app/Services/shared.service';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-emission-form',
  templateUrl: './emission-form.component.html',
  styleUrls: ['./emission-form.component.scss'],
})
export class EmissionFormComponent {
  consumption: ConsumptionDTO
  delegation: UntypedFormControl
  quantityEmission: UntypedFormControl
  scopeone: UntypedFormControl
  scopetwo: UntypedFormControl
  companyId: UntypedFormControl
  yearEmission: UntypedFormControl
  emissionForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated: boolean = true
  consumptionFields: string[] = []
  result : boolean =false

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private consumptionId: string | null;
  private userId: string | null;

  delegations!: DelegationDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'year', 'quantity', 'scopeone', 'scopetwo', 'ACTIONS'];
  dataSource = new MatTableDataSource(this.consumptions);

  @ViewChild('emissionTbSort') emissionTbSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.emissionTbSort;
  }
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
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

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, '', '', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.yearEmission = new UntypedFormControl('', [ Validators.required ]);
    this.quantityEmission = new UntypedFormControl('', [ Validators.required, Validators.min(1)]);

    this.scopeone = new UntypedFormControl('', [ Validators.required ]);
    this.scopetwo = new UntypedFormControl('', [ Validators.required ]);

    this.emissionForm = this.formBuilder.group({
      delegation: this.delegation,
      scopeone: this.scopeone,
      scopetwo: this.scopetwo,
      yearEmission: this.yearEmission,
      quantityEmission: this.quantityEmission,
    })

    this.loadDelegations();
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

  private loadConsumption(): void {
    let errorResponse: any;
    const userId = this.jwtHelper.decodeToken().id_ils;
    if (userId) {

        this.consumptionService.getAllConsumptionsByCompanyAndAspect(userId, 5).subscribe(
        (consumptions: ConsumptionDTO[]) => {
          this.consumptions = consumptions
          this.dataSource = new MatTableDataSource(this.consumptions)
          this.dataSource.sort = this.emissionTbSort
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  private createEmissionConsumption(): void {
    let errorResponse: any;
    let responseOK: boolean = false;

    if (this.userId) {
      this.consumption.companyId = this.userId;
      this.consumption.aspectId = 5; /* Emission aspect id : 5 */
      this.consumptionService.createEmissionConsumption(this.consumption)
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
            this.quantityEmission.reset()
            this.scopeone.reset()
            this.scopetwo.reset()
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

  deleteEmissionConsumption(consumptionId: number) {

    let errorResponse: any;
    this.result = confirm('Confirm delete this emission');

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

  updateEmissionConsumption(consumptionId: number) {
    this.result = confirm('Confirm update this consumption with id: ' + consumptionId + ' .');
  }

  saveEmissionForm(): void {
    this.isValidForm = false;
    if (this.emissionForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.consumption = this.emissionForm.value;

    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createEmissionConsumption();
    }

  }

  getRecord(row) {
    let errorResponse: any;
    console.log(row);
    this.consumptionService.deleteConsumption(row).subscribe(
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

  public applyFilter(value: Event):void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
