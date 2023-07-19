import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserDTO } from 'src/app/Models/user.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;

  name: UntypedFormControl;
  email: UntypedFormControl;
  nif: UntypedFormControl;
  domicilio: UntypedFormControl;
  localidad: UntypedFormControl;

  profileForm: UntypedFormGroup;
  isValidForm: boolean | null;
  isElevated = true;
  userFields: string[] = []

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.profileUser = new UserDTO('', '', '', '', '');

    this.isValidForm = null;

    this.name = new UntypedFormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.domicilio = new UntypedFormControl(this.profileUser.domicilio, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.localidad = new UntypedFormControl(this.profileUser.localidad, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new UntypedFormControl(this.profileUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.nif = new UntypedFormControl(this.profileUser.nif, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      nif: this.nif,
      domicilio: this.domicilio,
      localidad: this.localidad
    });
  }

  ngOnInit(): void {
    let errorResponse: any;
    // load user data
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.userService.getUSerByIdMySQL(userId).subscribe(
        (userData: UserDTO) => {
          this.userFields = Object.entries(userData).map( item => item[1])
          this.name.setValue(this.userFields[1]);
          this.email.setValue(this.userFields[8]);
          this.nif.setValue(this.userFields[2]);
          this.domicilio.setValue(this.userFields[3]);
          this.localidad.setValue(this.userFields[4]);

          this.profileForm = this.formBuilder.group({
            name: this.name,
            email: this.email,
            nif: this.nif,
            domicilio: this.domicilio,
            localidad: this.localidad
          });
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  updateUser(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;
 
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      this.userService
        .updateUserMySQL(userId, this.profileUser)
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
          () => {
            responseOK = true;
          },
          (error: HttpErrorResponse) => {
            responseOK = false;
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }
}
