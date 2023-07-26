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

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private delegationService: DelegationService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
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
    console.log( this.localStorageService.isLoggedIn())
    if (this.localStorageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.localStorageService.getUser().roles;
    }
  }

  /* login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService
      .login(this.loginUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'loginFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            const headerInfo: HeaderMenus = {
              showAuthSection: true,
              showNoAuthSection: false,
            };
            this.headerMenusService.headerManagement.next(headerInfo);
            this.router.navigateByUrl('home');
          }
        })
      )
      .subscribe(
        (resp: AuthToken) => {
          responseOK = true;
          console.log (`----${resp}----`)
          this.loginUser.user_id = resp.user_id;
          this.loginUser.access_token = resp.access_token;

          this.localStorageService.set('user_id', this.loginUser.user_id);
          this.localStorageService.set('access_token', this.loginUser.access_token);
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.headerMenusService.headerManagement.next(headerInfo);

          this.sharedService.errorLog(error.error);
        }
      );
  } */

  loginObservable() {
    let responseOK: boolean = false;
    let errorResponse: any;
    let totalDelegations: number;
    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    if ( this.loginUser ) {
        this.authService.login( this.loginUser )
            .subscribe(
                (item:AuthToken ) => {
                    console.log ("Welcome to the ILS datalogger.industrialocalsostenible.com created by IDI!!")
                    responseOK = true;
                    this.loginUser.user_id = item.user_id;
                    this.loginUser.access_token = item.access_token;
                    this.localStorageService.set('user_id', this.loginUser.user_id);
                    this.localStorageService.set('access_token', this.loginUser.access_token);

                    this.sharedService.managementToast( 'loginFeedback', responseOK, errorResponse );

                    if (responseOK) {
                      const headerInfo: HeaderMenus = {
                        showAuthSection: true,
                        showNoAuthSection: false,
                      };

                      this.headerMenusService.headerManagement.next(headerInfo);
                      this.delegationService.getTotalDelegationsByCompany(this.loginUser.user_id)
                      .subscribe( item => {
                        totalDelegations = item.totalDelegations
console.log(totalDelegations)
                        if (totalDelegations == 0) {
                          this.router.navigateByUrl('profile');
                        } else {
                          this.router.navigateByUrl('user/consumption');
                        }
                      } )

                    }
                }
                ,
      (error: any) => {
        responseOK = false;
        errorResponse = error.error;
        const headerInfo: HeaderMenus = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);
        this.sharedService.errorLog(error.error);
      },
      () => console.log("Processing Complete.")
            )

            ;
    }
}

 async login(): Promise<void> {
    let responseOK: boolean = false;
    let errorResponse: any;
    let totalDelegations: number;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
    try {

      const authToken = await this.authService.loginp(this.loginUser);
      console.log ("Welcome to the ILS datalogger.industrialocalsostenible.com created by IDI!!")
      responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token);

    } catch (error: any) {

      responseOK = false;
      errorResponse = error.error;
      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      this.sharedService.errorLog(error.error);

    }

    await this.sharedService.managementToast( 'loginFeedback', responseOK, errorResponse );

    if (responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
      };
      // update options menu

      this.headerMenusService.headerManagement.next(headerInfo);
      this.delegationService.getTotalDelegationsByCompany(this.loginUser.user_id)
      .subscribe( item => {
        totalDelegations = item.totalDelegations

        if (totalDelegations == 0) {
          this.router.navigateByUrl('profile');
        } else {
          this.router.navigateByUrl('user/consumption');
        }
      } )

    }
  }

 /*  onSubmit(): void {
    let responseOK: boolean = false;
    let errorResponse: any;
    let totalDelegations: number;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService.login(this.loginUser)
    .subscribe(
       data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        console.log ("Welcome to the ILS datalogger.industrialocalsostenible.com created by IDI!!")
        responseOK = true;

        this.sharedService.managementToast( 'loginFeedback', responseOK, errorResponse );

        if (responseOK) {
          const headerInfo: HeaderMenus = {
            showAuthSection: true,
            showNoAuthSection: false,
          };
          // update options menu

          this.headerMenusService.headerManagement.next(headerInfo);
          this.delegationService.getTotalDelegationsByCompany(this.loginUser.user_id)
          .subscribe( item => {
            totalDelegations = item.totalDelegations

            if (totalDelegations == 0) {
              this.router.navigateByUrl('profile');
            } else {
              this.router.navigateByUrl('user/consumption');
            }
          } )

        }

       this.reloadPage();
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

        responseOK = false;
        errorResponse = err.error;
        const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      this.sharedService.errorLog(err.error);

      }
    );
  } */
}
