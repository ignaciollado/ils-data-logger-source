import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  empresa: UntypedFormControl
  email: UntypedFormControl
  nif: UntypedFormControl
  domicilio: UntypedFormControl
  cnaeSelect: UntypedFormControl
  activityIndicator: UntypedFormControl
  currentActivityIndicator: UntypedFormControl

  profileForm: UntypedFormGroup
  isValidForm: boolean | null
  isElevated = true
  userFields: string[] = []
  enterpriseActivityIndicatorsTemp: CnaeDTO[] = []
  enterpriseActivityIndicators: any[] = []

  selected: string
  access_token: string | null
  isCompany: boolean
  private userId: string | null

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
  ) {
    this.profileUser = new UserDTO('', '', '', '', '', '', '', false, false);
    this.isValidForm = null;

    this.userId = this.jwtHelper.decodeToken().id_ils

    this.empresa = new UntypedFormControl(this.profileUser.empresa, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]);

    this.domicilio = new UntypedFormControl(this.profileUser.domicilio, [
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
      Validators.minLength(9),
      Validators.maxLength(9)
    ]);

    this.currentActivityIndicator = new UntypedFormControl({value: this.profileUser.activityIndicator, disabled: true}, 
      [ Validators.required ]);


    this.cnaeSelect = new UntypedFormControl(this.profileUser.cnae, [ Validators.required ]);

    this.activityIndicator = new UntypedFormControl({value: this.profileUser.activityIndicator, disabled: true}, [ Validators.required ]);

    this.profileForm = this.formBuilder.group({
      empresa: this.empresa,
      nif: this.nif,
      domicilio: this.domicilio,
      email: this.email,
     /*  cnaeSelect: this.cnaeSelect,
      currentActivityIndicator: this.currentActivityIndicator,
      activityIndicator: this.activityIndicator */
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
    let errorResponse: any
    if (this.userId) {
      // obtengo los datos del usuario donde: $userId conincide con id de pindust_expediente ()
      // la lista de usuarios de esta app está en jwt.idi.es tabla 'users'
      this.userService.getUSerByIdMySQL(this.userId).subscribe( 
        (userData: UserDTO) => {
          this.empresa.setValue(userData.empresa)
          this.nif.setValue(userData.nif)
          this.domicilio.setValue(userData.domicilio)
          this.cnaeSelect.setValue(userData.cnae)
          this.email.setValue(userData.email_rep)
          this.currentActivityIndicator.setValue(userData.activityIndicator)
          this.cnaeSelected(userData.cnae)
          this.activityIndicatorSelected(userData.cnae)
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

    this.isValidForm = true
    this.profileUser = this.profileForm.value

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
    console.log ("cnaeItem", cnaeItem)
    if (cnaeItem) {
      this.enterpriseActivityIndicatorsTemp = this.cnaeList.filter( item => item.cnaeCode === cnaeItem )
      this.enterpriseActivityIndicatorsTemp.map((item:any) => {   
        this.enterpriseActivityIndicators = JSON.parse(item.activityIndicator)
        console.log("enterpriseActivityIndicators", item.activityIndicator, this.enterpriseActivityIndicators)
      })
      this.activityIndicator.enable()
    }
  }

  public activityIndicatorSelected( activityInd: any ) {
    console.log("activityInd.value", activityInd)
  }
}
