import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { AspectService } from 'src/app/Services/aspect.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-energy-form',
  templateUrl: './energy-form.component.html',
  styleUrls: ['./energy-form.component.scss'],
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

export class EnergyFormComponent implements OnInit {
  energy: EnergyDTO
  nameES: UntypedFormControl
  nameCA: UntypedFormControl
  unit: UntypedFormControl
  pci: UntypedFormControl
  energyForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  delegationFields: string[] = []
  showButtons: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  access_token: string | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private energyId: string | null;

  constructor(
    private energyService: EnergyService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,

  ) {
    this.isValidForm = null;
    this.access_token = sessionStorage.getItem("access_token")
    this.energyId = ""
    this.showButtons = false
    this.showAuthSection = false;
    this.showNoAuthSection = true;

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {

        const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
      } else {
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo)
        this.router.navigateByUrl('login')
      }
    }

    this.energy = new EnergyDTO ('', '', 0, '', 0, 0, new Date(), new Date());
    this.isUpdateMode = false;
    this.validRequest = false;

    this.nameES = new UntypedFormControl(this.energy.nameES, [ Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25), ]);
    this.nameCA = new UntypedFormControl(this.energy.nameCA, [ Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25), ]);
    this.pci = new UntypedFormControl(this.energy.pci, [ Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25), ]);
    this.unit = new UntypedFormControl(this.energy.unit, [ Validators.required,
      Validators.minLength(1),
      Validators.maxLength(25), ]);

    this.energyForm = this.formBuilder.group({
      nameES: this.nameES,
      nameCA: this.nameCA,
      pci: this.pci,
      unit: this.unit
    });

  }

  ngOnInit(): void {
    let errorResponse: any;
    // update
    if (this.energyId) {
      this.isUpdateMode = true;
    }
  }

  saveEnergy(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.energyForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.energy = this.energyForm.value;
    this.energy.aspectId = 1

    this.energyService
    .createEnergy(this.energy)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'registerFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.energyForm.reset();
            this.router.navigateByUrl('energies');
          }
        })
      )
      .subscribe(
        () => {
          responseOK = true;
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;

          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };

          this.headerMenusService.headerManagement.next(headerInfo);
          this.sharedService.errorLog(errorResponse);
        }
      );
  }

}
