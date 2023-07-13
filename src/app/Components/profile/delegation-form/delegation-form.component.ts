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
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { DelegationService } from 'src/app/Services/delegation.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styleUrls: ['./delegation-form.component.scss'],
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

export class DelegationFormComponent implements OnInit {

  delegation: DelegationDTO
  name: UntypedFormControl
  address: UntypedFormControl

  delegationForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  delegationFields: string[] = []

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private companyId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private delegationService: DelegationService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService,

  ) {

    this.isValidForm = null;
    this.companyId = this.localStorageService.get('user_id');
    
    this.delegation = new DelegationDTO('', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.name = new UntypedFormControl(this.delegation.name, [ Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25), ]);
    this.address = new UntypedFormControl(this.delegation.address, [ Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25), ]);

    this.delegationForm = this.formBuilder.group({
      name: this.name,
      address: this.address
    });

  }

  ngOnInit(): void {
    let errorResponse: any;
    // update
    if (this.companyId) {
      
      this.isUpdateMode = true;

    }
  }

  saveDelegation(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.delegationForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.delegation = this.delegationForm.value;
    this.delegation.companyId = this.companyId;
console.log (this.delegation)
    this.delegationService
    .createDelegation(this.delegation)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'registerFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.delegationForm.reset();
            this.router.navigateByUrl('profile');
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
