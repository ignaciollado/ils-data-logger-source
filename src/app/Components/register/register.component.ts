import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { MustMatch } from 'src/app/_helpers';
import { EmailManagementService } from 'src/app/Services/emailManagement.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  registerUser: UserDTO;

  name: UntypedFormControl
  email: UntypedFormControl
  password: UntypedFormControl
  confirmPassword: UntypedFormControl

  domicilio: UntypedFormControl
  cnae: UntypedFormControl

  registerForm: UntypedFormGroup
  isValidForm: boolean | null
  isValidMail: boolean | null
  isElevated = true
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router,
    private emailManagementService: EmailManagementService
  ) {
    this.registerUser = new UserDTO('', '', '', '', '', '', '', false, false);
    this.isValidForm = null;

    this.name = new UntypedFormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(55),
    ]);

    this.domicilio = new UntypedFormControl(this.registerUser.domicilio, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(55),
    ]);

    this.email = new UntypedFormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
    ]);

    this.confirmPassword = new UntypedFormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
    ]);

    this.cnae = new UntypedFormControl(this.registerUser.cnae, [ Validators.required ]);

    this.registerForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    },{
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {}

  register(): void {
  this.isValidForm = false;

  if (this.registerForm.invalid) {
    return;
  }

  this.isValidForm = true;
  const registerUser = this.registerForm.value;

  this.userService
    .register(registerUser)
    .subscribe(
      (resp: any) => {
        console.log('✅ Registro exitoso:', resp);

        // Mostrar mensaje de registro exitoso
        this.sharedService.showSnackBar('User created successfully!!!');

        // Desactivar formulario
        this.registerForm.disable();

        // Enviar correo de confirmación
        this.emailManagementService.sendCustomerEmail(this.registerForm).subscribe({
          next: (sendMailResult: any) => {
            // Si por algún motivo entra aquí, mostramos el resultado
            this.sharedService.showSnackBarLongTime(sendMailResult);
          },
          error: (mailError: any) => {
            console.log('📧 Respuesta del envío de correo:', mailError);

            // 🔹 Considerar enviado correctamente si status === 200
            if (mailError.status === 200 && mailError.error?.text) {
              this.sharedService.showSnackBarLongTime(mailError.error.text);
            } else {
              console.error('❌ Error enviando correo:', mailError);
              this.sharedService.showSnackBar('Error al enviar el correo electrónico.');
            }
          }
        });

        // this.router.navigateByUrl('/login');
      },
      (error: HttpErrorResponse) => {
        console.error('❌ Error en registro:', error);
        const errorResponse = error.error;

        // Caso específico: Email ya existe
        if (error.status === 409 && error.error?.messages?.error) {
          const errorMsg = error.error.messages.error;
          this.sharedService.showSnackBar(errorMsg);

          // No desactivar el formulario, limpiar email y password
          this.registerForm.get('email')?.reset();
          this.registerForm.get('password')?.reset();
        } else if (typeof errorResponse === 'string') {
          this.sharedService.showSnackBar(errorResponse);
        } else {
          this.sharedService.showSnackBar('An unexpected error occurred.');
        }

        // Actualizar cabecera
        const headerInfo: HeaderMenus = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);
      }
    );
  }

  public generatePassword() {
    this.password.setValue( Math.random().toString(36).slice(-8) )
    this.confirmPassword.setValue( this.password.value )
  }

  public validateTheEMail() {
    /* ES UN SERVICIO DE PAGO por lo que ANULO LAS PETICIONES */
    /* this.emailManagementService.validateThisEmail(this.email.value)
      .subscribe((theValidationResult:any) =>{
        if (theValidationResult.deliverability == "DELIVERABLE") {
          this.isValidMail = true
        } else {
          this.isValidMail = false
        }
      }) */
  }
}
