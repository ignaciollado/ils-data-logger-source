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
import { AspectDTO } from 'src/app/Models/aspect.dto';
import { AspectService } from 'src/app/Services/aspect.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';

@Component({
  selector: 'app-aspect-form',
  templateUrl: './aspect-form.component.html',
  styleUrls: ['./aspect-form.component.scss'],
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
export class AspectFormComponent implements OnInit {
  aspect: AspectDTO
  nameES: UntypedFormControl
  nameCA: UntypedFormControl

  aspectForm: UntypedFormGroup

  isValidForm: boolean | null
  isElevated = true
  delegationFields: string[] = []

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private aspectId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aspectService: AspectService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private headerMenusService: HeaderMenusService,

  ) {

    this.isValidForm = null;
    this.aspectId = this.localStorageService.get('user_id');

    this.aspect = new AspectDTO ('', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.nameES = new UntypedFormControl(this.aspect.nameES, [ Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25), ]);
    this.nameCA = new UntypedFormControl(this.aspect.nameCA, [ Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25), ]);

    this.aspectForm = this.formBuilder.group({
      nameES: this.nameES,
      nameCA: this.nameCA
    });

  }

  ngOnInit(): void {
    let errorResponse: any;
    // update
    if (this.aspectId) {
      this.isUpdateMode = true;
    }
  }

  saveAspect(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.aspectForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.aspect = this.aspectForm.value;
    this.aspectService
    .createAspect(this.aspect)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'registerFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.aspectForm.reset();
            this.router.navigateByUrl('aspects');
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
