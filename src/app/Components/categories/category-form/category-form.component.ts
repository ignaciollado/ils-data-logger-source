import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { EnergyService } from 'src/app/Services/energy.service';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations'

interface enviromentalAspects {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
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
  ]
})

export class CategoryFormComponent implements OnInit {
  energy: EnergyDTO
  nameES: UntypedFormControl
  nameCA: UntypedFormControl
  aspectId: UntypedFormControl
  unit: UntypedFormControl
  pci: UntypedFormControl
  createAt: UntypedFormControl
  updatedAt: UntypedFormControl

  energyForm: UntypedFormGroup;
  isValidForm: boolean | null;
  isElevated = true;
  
  private isUpdateMode: boolean;
  private categoryId: string | null;

  enviromentalAspects: enviromentalAspects[] = [
    {value: '0', viewValue: 'Energía'},
    {value: '1', viewValue: 'Agua'},
    {value: '2', viewValue: 'Residuos'},
    {value: '3', viewValue: 'Materiales'},
    {value: '4', viewValue: 'Emisiones'},
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private energyService: EnergyService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.energy = new EnergyDTO('', '', 0, '', 0, new Date(), new Date());
    this.isUpdateMode = false;

    this.nameES = new UntypedFormControl(this.energy.nameES, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.nameCA = new UntypedFormControl(this.energy.nameCA, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.aspectId = new UntypedFormControl(this.energy.aspectId, [
      Validators.required,
    ]);

    this.unit = new UntypedFormControl(this.energy.unit, [
      Validators.required,
    ]);

    this.pci = new UntypedFormControl(this.energy.pci, [
      Validators.required,
    ]);
    
    this.createAt = new UntypedFormControl(
      formatDate(this.energy.createAt, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.updatedAt = new UntypedFormControl(
      formatDate(this.energy.updatedAt, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.energyForm = this.formBuilder.group({

      nameES: this.nameES,
      nameCA: this.nameCA,
      aspectId: this.aspectId,
      unit: this.unit,
      pci: this.pci,
      createAt: this.createAt,
      updateAt: this.updatedAt
     
    });
  }

  ngOnInit(): void {
    let errorResponse: any;

    // update
    if (this.categoryId) {
      this.isUpdateMode = true;

      this.energyService.getFuelById(this.categoryId).subscribe(
        (energy: EnergyDTO) => {
          this.energy = energy;

          this.nameES.setValue(this.energy.nameES);

          this.nameCA.setValue(this.energy.nameCA);

          this.aspectId.setValue(this.energy.aspectId);

          this.unit.setValue(this.energy.unit);

          this.pci.setValue(this.energy.pci);

          this.createAt.setValue(this.energy.createAt);

          this.updatedAt.setValue(this.energy.updatedAt);

          this.energyForm = this.formBuilder.group({
            nameES: this.nameES,
            nameCA: this.nameCA,
            aspectId: this.aspectId,
            unit: this.unit,
            pci: this.pci,
            createAt: this.createAt,
            updateAt: this.updatedAt
          });
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private editCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.categoryId) {
        this.energyService
          .updateFuel(this.categoryId, this.energy)
          .pipe(
            finalize(async () => {
              await this.sharedService.managementToast(
                'categoryFeedback',
                responseOK,
                errorResponse
              );

              if (responseOK) {
                this.router.navigateByUrl('categories');
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

  private createCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
      this.energyService
        .createFuel(this.energy)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'categoryFeedback',
              responseOK,
              errorResponse
            );

            if (responseOK) {
              this.router.navigateByUrl('categories');
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

  saveCategory(): void {

    this.isValidForm = false;
    if (this.energyForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.energy = this.energyForm.value;

    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }

  }
}
