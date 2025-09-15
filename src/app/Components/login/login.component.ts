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
import { SharedService } from 'src/app/Services/shared.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, finalize } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  ],
})

export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;
  value = 'Clear me';
  isElevated = true;
  hide = true;
  isCompany: boolean = false
  userId: string = ""
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
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    localStorage.removeItem("preferredLang")
    if(localStorage.getItem("preferredLang") === 'undefined' || localStorage.getItem("preferredLang") === null) {
      localStorage.setItem("preferredLang", "cas")
    } 
    this.loginUser = new AuthDTO('', '', '', '');
    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
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
        this.router.navigateByUrl('dashboard')
      } else {
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo);
        this.router.navigateByUrl('login');
      }
    }
  }

  loginApp() {
    let responseOK: boolean = false
    let errorResponse: any
    this.loginUser.email = this.email.value
    this.loginUser.password = this.password.value

    if ( this.loginUser ) {
        this.authService.login( this.loginUser )
          /* .pipe( 
          catchError(this.sharedService.handleError), 
           finalize(async () => {
            responseOK = false
            errorResponse = "Login successfully!!!"
            this.sharedService.showSnackBar( errorResponse )
            if (responseOK) {
              this.router.navigateByUrl('posts');
            }
          })
            )  */
        .subscribe(
          (item:AuthToken ) => {
            console.log ("Welcome to the ILS datalogger.industrialocalsostenible.com created by IDI!!")
            responseOK = true;
            errorResponse = "login correct"
            this.loginUser.user_id = item.user_id
            this.loginUser.access_token = item.access_token
            sessionStorage.setItem('user_id', this.loginUser.user_id)
            sessionStorage.setItem('access_token', this.loginUser.access_token)
            this.sharedService.showSnackBar( 'Login successfully!' )

            if (this.jwtHelper.decodeToken().role === 'admin') {
              this.isCompany = false
            }

            if (responseOK) {
              const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
              this.headerMenusService.headerManagement.next(headerInfo);
              this.router.navigateByUrl('profile');
              this.delegationService.getTotalDelegationsByCompany(this.jwtHelper.decodeToken().id_ils)
                .subscribe( item => {
                  if (item.totalDelegations == 0) {
                    this.router.navigateByUrl('profile')
                  } else {
                    this.router.navigateByUrl('global-questionnaire-list')
                  }
                } )

            }
                },
                (error: any) => {
                  responseOK = false;
                  errorResponse = error.status;
                  const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
                  this.headerMenusService.headerManagement.next(headerInfo);
                  this.sharedService.showSnackBar(error.error.messages.error);
                },
                  () => console.log("Login complete.")
        )
    }
  }
}
