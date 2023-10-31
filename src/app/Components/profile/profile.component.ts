import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { finalize } from 'rxjs/operators';
import { UserDTO } from 'src/app/Models/user.dto';
import { CnaeDTO } from 'src/app/Models/cnae.dto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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

export class ProfileComponent implements OnInit {
  profileUser: UserDTO;
  cnae: CnaeDTO
  cnaeList: CnaeDTO[]
  name: UntypedFormControl
  email: UntypedFormControl
  nif: UntypedFormControl
  domicilio: UntypedFormControl
  localidad: UntypedFormControl
  cnaeSelect: UntypedFormControl
  activityIndicator: UntypedFormControl
  currentActivityIndicator: string

  profileForm: UntypedFormGroup
  isValidForm: boolean | null
  isElevated = true
  userFields: string[] = []
  enterpriseActivityIndicatorsTemp: CnaeDTO[] = []
  enterpriseActivityIndicators: any[] = []

  selected: string
  access_token: string | null
  private userId: string | null

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
  ) {
    this.profileUser = new UserDTO('', '', '', '', '', '', '');
    this.isValidForm = null;

    this.userId = this.jwtHelper.decodeToken().id_ils

    this.name = new UntypedFormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);

    this.domicilio = new UntypedFormControl(this.profileUser.domicilio, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);

    this.localidad = new UntypedFormControl(this.profileUser.localidad, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);

    this.email = new UntypedFormControl(this.profileUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.nif = new UntypedFormControl(this.profileUser.nif, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.cnaeSelect = new UntypedFormControl(this.profileUser.cnae, [ Validators.required ]);

    this.activityIndicator = new UntypedFormControl({value: this.profileUser.activityIndicator, disabled: true}, [ Validators.required ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      nif: this.nif,
      domicilio: this.domicilio,
      localidad: this.localidad,
      cnaeSelect: this.cnaeSelect,
      activityIndicator: this.activityIndicator
    });

    this.access_token = sessionStorage.getItem("access_token")

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo)
      }
    }
    this.loadCnaes()
  }

  ngOnInit(): void {
    let errorResponse: any;
    
    if (this.userId) {
      this.userService.getUSerByIdMySQL(this.userId).subscribe(
        (userData: UserDTO) => {
          this.userFields = Object.entries(userData).map( item => item[1])
          this.name.setValue(this.userFields[1])
          this.nif.setValue(this.userFields[2])
          this.domicilio.setValue(this.userFields[3])
          this.localidad.setValue(this.userFields[4])
          this.cnaeSelect.setValue(this.userFields[6])
          this.activityIndicator.setValue(this.userFields[7])
          this.currentActivityIndicator = JSON.parse(JSON.stringify(this.userFields[7]))
          this.email.setValue(this.userFields[10])

          this.profileForm = this.formBuilder.group({
            name: this.name,
            nif: this.nif,
            domicilio: this.domicilio,
            email: this.email,
            localidad: this.localidad,
            cnaeSelect: this.cnaeSelect,
            activityIndicator: this.activityIndicator
          });
          this.cnaeSelected(this.userFields[6])
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadCnaes(): void {
    let errorResponse: any;
    this.userService.getUserCnae().subscribe(
      (cnaes: CnaeDTO[]) => {
        this.cnaeList = cnaes
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse)
      }
    );
  }

  public updateUser(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    if (this.userId) {
      this.userService
        .updateUserPindustExpedientes(this.userId, this.profileUser)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'profileFeedback',
              responseOK,
              errorResponse
            );
          })
        )
        .subscribe(
          ( data ) => {
            responseOK = true
          },
          (error: HttpErrorResponse) => {
            responseOK = false;
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

  public cnaeSelected(cnaeItem: any) {

    this.enterpriseActivityIndicatorsTemp = this.cnaeList.filter( item => item.cnaeCode === cnaeItem.value )
    this.enterpriseActivityIndicators = this.enterpriseActivityIndicatorsTemp[0].activityIndicator
    this.activityIndicator.enable() 

  }

  public activityIndicatorSelected( activityInd: any ) {
    console.log(activityInd.value)
  }
}
