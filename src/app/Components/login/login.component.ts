import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AuthService, AuthToken } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations'
import { DelegationService } from 'src/app/Services/delegation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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

export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;
  value = 'Clear me';
  isElevated = true;
  hide = true;
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  roles: string[] = [];

  responseOK: boolean = false;
  errorResponse: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private delegationService: DelegationService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('nacho@gmail.com', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('12345678', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {

    const access_token: string | null = sessionStorage.getItem("access_token")
    if (access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (access_token)) {
        const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
        this.router.navigateByUrl('user/consumption')
      } else {
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('user_id') //this.localStorageService.remove('user_id');
        sessionStorage.removeItem('access_token') //this.localStorageService.remove('access_token');
        this.headerMenusService.headerManagement.next(headerInfo);
        this.router.navigateByUrl('login');
      }
      /* console.log (this.jwtHelper.isTokenExpired (access_token))
      console.log (this.jwtHelper.decodeToken (access_token).user_id)
      console.log (this.jwtHelper.decodeToken (access_token).id_ils)
      console.log (this.jwtHelper.getTokenExpirationDate(access_token)) */
    }

  }

  loginObservable() {
    let responseOK: boolean = false
    let errorResponse: any
    let totalDelegations: number
    this.loginUser.email = this.email.value
    this.loginUser.password = this.password.value

    if ( this.loginUser ) {
        this.authService.login( this.loginUser )
            .subscribe(
                (item:AuthToken ) => {
                    console.log ("Welcome to the ILS datalogger.industrialocalsostenible.com created by IDI!!")
                    responseOK = true;
                    this.loginUser.user_id = item.user_id
                    this.loginUser.access_token = item.access_token
                    sessionStorage.setItem('user_id', this.loginUser.user_id)
                    sessionStorage.setItem('access_token', this.loginUser.access_token)

                    /* this.localStorageService.set('user_id', this.loginUser.user_id)
                    this.localStorageService.set('access_token', this.loginUser.access_token) */

                    this.sharedService.managementToast( 'loginFeedback', responseOK, errorResponse )

                    if (responseOK) {
                      const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
                      this.router.navigateByUrl('profile');
                      this.headerMenusService.headerManagement.next(headerInfo);
                      this.delegationService.getTotalDelegationsByCompany(this.loginUser.user_id)
                      .subscribe( item => {
                        totalDelegations = item.totalDelegations
                        if (totalDelegations == 0) {
                          this.router.navigateByUrl('profile')
                        } else {
                          this.router.navigateByUrl('user/consumption')
                        }
                      } )

                    }
                }
                ,
      (error: any) => {
        responseOK = false;
        errorResponse = error.error;
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        this.headerMenusService.headerManagement.next(headerInfo);
        this.sharedService.errorLog(error.error);
      },
      () => console.log("Processing Complete.")
            )

            ;
    }
}
}
