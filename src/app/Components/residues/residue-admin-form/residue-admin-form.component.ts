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
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { ResidueService } from 'src/app/Services/residue.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';

@Component({
  selector: 'app-residue-admin-form',
  templateUrl: './residue-admin-form.component.html',
  styleUrls: ['./residue-admin-form.component.scss'],
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
export class ResidueAdminFormComponent implements OnInit {
    residue: ResidueDTO
    nameES: UntypedFormControl
    nameCA: UntypedFormControl

    residueForm: UntypedFormGroup
  
    isValidForm: boolean | null
    isElevated = true
    delegationFields: string[] = []
  
    private isUpdateMode: boolean;
    private validRequest: boolean;
    private residueId: string | null;
  
    constructor(
      private activatedRoute: ActivatedRoute,
      private residueService: ResidueService,
      private formBuilder: UntypedFormBuilder,
      private router: Router,
      private sharedService: SharedService,
      private localStorageService: LocalStorageService,
      private headerMenusService: HeaderMenusService,
  
    ) {
  
      this.isValidForm = null;
      this.residueId = this.localStorageService.get('user_id');
  
      this.residue = new ResidueDTO ('', '', false, false, false, false, false );
      this.isUpdateMode = false;
      this.validRequest = false;
  
      this.nameES = new UntypedFormControl(this.residue.nameES, [ Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25), ]);
      this.nameCA = new UntypedFormControl(this.residue.nameCA, [ Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25), ]);
     
      this.residueForm = this.formBuilder.group({
        nameES: this.nameES,
        nameCA: this.nameCA
      });
  
    }

    ngOnInit(): void {
      let errorResponse: any;
      // update
      if (this.residueId) {
        
        this.isUpdateMode = true;
  
      }
    }
  
    saveResidue(): void {
      let responseOK: boolean = false;
      this.isValidForm = false;
      let errorResponse: any;
  
      if (this.residueForm.invalid) {
        return;
      }
  
      this.isValidForm = true;
      this.residue = this.residueForm.value;
  
      this.residueService
      .createResidue(this.residue)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'registerFeedback',
              responseOK,
              errorResponse
            );
  
            if (responseOK) {
              this.residueForm.reset();
              this.router.navigateByUrl('residues');
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
