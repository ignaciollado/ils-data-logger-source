import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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
import { min } from 'moment';
import { ResidueService } from 'src/app/Services/residue.service';
import { ResidueDTO } from 'src/app/Models/residue.dto';

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
  fromDateResidue: UntypedFormControl
  toDateResidue: UntypedFormControl
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
  residues!: ResidueDTO[];
  consumptions!: ConsumptionDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['delegation', 'residue', 'quantity', 'reuse', 'recycling', 'incineration',  'dump', 'compost', 'fromDate', 'toDate', 'ACTIONS'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private consumptionService: ConsumptionService,
    private delegationService: DelegationService,
    private residueService: ResidueService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {

    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);

    this.isValidForm = null;
    this.consumptionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = this.localStorageService.get('user_id');

    this.consumption = new ConsumptionDTO(0, 0, this._adapter.today(), this._adapter.today(), '', '', '','','','', 0, '', '', 0);
    this.isUpdateMode = false;
    this.validRequest = false;
    this.delegation = new UntypedFormControl('', [ Validators.required ]);
    this.residue = new UntypedFormControl('', [ Validators.required ]);
    this.reuse = new UntypedFormControl('', [ Validators.required, Validators.min(0), Validators.max(100) ]);
    this.recycling = new UntypedFormControl('', [ Validators.required, Validators.min(0), Validators.max(100) ]);
    this.incineration = new UntypedFormControl('', [ Validators.required, Validators.min(0), Validators.max(100) ]);
    this.dump = new UntypedFormControl('', [ Validators.required, Validators.min(0), Validators.max(100) ]);
    this.compost = new UntypedFormControl('', [ Validators.required, Validators.min(0), Validators.max(100) ]);
    this.quantityResidue = new UntypedFormControl('', [ Validators.required, Validators.min(0) ]);
    this.companyId = new UntypedFormControl(this.userId, [ Validators.required ]);
    this.fromDateResidue = new UntypedFormControl('', [ Validators.required ]);
    this.toDateResidue = new UntypedFormControl('', [ Validators.required ]);

    this.loadDelegations();
    this.loadResidues();

    this.residueForm = this.formBuilder.group({
      delegation: this.delegation,
      residue: this.residue,
      reuse: this.reuse,
      recycling: this.recycling,
      incineration: this.incineration,
      dump: this.dump,
      compost: this.compost,
      fromDateResidue: this.fromDateResidue,
      toDateResidue: this.toDateResidue,
      quantityResidue: this.quantityResidue
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
    const userId = this.localStorageService.get('user_id');
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

  private editPost(): void {

  }

  deleteResidueConsumption(consumptionId: string): void {

    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete this consumption with id: ' + consumptionId + ' .');
    if (result) {
      this.consumptionService.deleteConsumptions(consumptionId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadConsumption();
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
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
      this.editPost();
    } else {
      this.createResidueConsumption();
    }

  }

}
