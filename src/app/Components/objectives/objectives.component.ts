import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DelegationService } from 'src/app/Services/delegation.service';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { EnergyDTO } from 'src/app/Models/energy.dto';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/Services/shared.service';
import { EnergyService } from 'src/app/Services/energy.service';
import { ResidueDTO } from 'src/app/Models/residue.dto';
import { ResidueService } from 'src/app/Services/residue.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent {

  delegation: UntypedFormControl
  energy: UntypedFormControl
  companyId: UntypedFormControl

  genCnae: UntypedFormControl
  febCnae: UntypedFormControl
  marCnae: UntypedFormControl
  aprCnae: UntypedFormControl
  mayCnae: UntypedFormControl
  junCnae: UntypedFormControl
  julCnae: UntypedFormControl
  augCnae: UntypedFormControl
  sepCnae: UntypedFormControl
  octCnae: UntypedFormControl
  novCnae: UntypedFormControl
  decCnae: UntypedFormControl

  genBill: UntypedFormControl
  febBill: UntypedFormControl
  marBill: UntypedFormControl
  aprBill: UntypedFormControl
  mayBill: UntypedFormControl
  junBill: UntypedFormControl
  julBill: UntypedFormControl
  augBill: UntypedFormControl
  sepBill: UntypedFormControl
  octBill: UntypedFormControl
  novBill: UntypedFormControl
  decBill: UntypedFormControl

  objectiveForm: UntypedFormGroup
  delegations!: DelegationDTO[]
  energies!: EnergyDTO[];
  residues!: ResidueDTO[];
  yearObjective: UntypedFormControl
  userFields: string[] = []

  private userId: string | null
  currentActivityIndicator: string = "pending..."

  constructor(
    private delegationService: DelegationService,
    private jwtHelper: JwtHelperService,
    private sharedService: SharedService,
    private energyService: EnergyService,
    private residueService: ResidueService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils;

    this.energy = new UntypedFormControl('', [ Validators.required ])
    this.delegation = new UntypedFormControl( '', [ Validators.required ] );
    this.companyId = new UntypedFormControl( this.userId, [ Validators.required ] );
    this.yearObjective = new UntypedFormControl('', [ Validators.required ]);

    this.genCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.febCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.marCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.aprCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.mayCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.junCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.julCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.augCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.sepCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.octCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.novCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.decCnae= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])

    this.genBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.febBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.marBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.aprBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.mayBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.junBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.julBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.augBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.sepBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.octBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.novBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])
    this.decBill= new UntypedFormControl('', [ Validators.required , Validators.min(1) ])

    this.objectiveForm = this.formBuilder.group({
      delegation: this.delegation,
      energy: this.energy,
      yearObjective: this.yearObjective,
      genCnae: this.genCnae,
      genBill: this.genBill,
      febCnae: this.febCnae,
      febBill: this.febBill,
      marCnae: this.marCnae,
      marBill: this.marBill,
      aprCnae: this.aprCnae,
      aprBill: this.aprBill,
      mayCnae: this.mayCnae,
      mayBill: this.mayBill,      
      junCnae: this.junCnae,
      junBill: this.junBill,
      julCnae: this.julCnae,
      julBill: this.julBill,
      augCnae: this.augCnae,
      augBill: this.augBill,
      sepCnae: this.sepCnae,
      sepBill: this.sepBill,
      octCnae: this.octCnae,
      octBill: this.octBill,
      novCnae: this.novCnae,
      novBill: this.novBill,
      decCnae: this.decCnae,
      decBill: this.decBill,
    })

    this.loadDelegations()
    this.loadEnergies()
    this.loadResidues()
    this.getCurrentIndicator(this.userId)
  }

  private loadDelegations(): void {
    let errorResponse: any;
    if (this.userId) {
      this.delegationService.getAllDelegationsByCompanyIdFromMySQL(this.userId).subscribe(
        (delegations: DelegationDTO[]) => {
          this.delegations = delegations;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadEnergies(): void {
    let errorResponse: any;
    if (this.userId) {
      this.energyService.getAllEnergies().subscribe(
        (energies: EnergyDTO[]) => {
          this.energies = energies;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private loadResidues( ): void {
    let errorResponse: any;
    if (this.userId) {
      this.residueService.getAllResidues().subscribe(
        (residues: ResidueDTO[]) => {
          this.residues = residues;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private getCurrentIndicator( companyId: string ){
    let errorResponse: any;
    if (companyId) {
      this.userService.getUSerByIdMySQL(companyId).subscribe(
        (userData: UserDTO) => {
          console.log (companyId, Object.entries(userData).map( item => item[1]),  JSON.parse(JSON.stringify(this.userFields[7])))
          this.userFields = Object.entries(userData).map( item => item[1])
          this.currentActivityIndicator =  JSON.parse(JSON.stringify(this.userFields[7]));
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  public saveObjectiveForm( ) {

  }
         
  public copyCnaeMonthValue( resource: string ) {
    this.genCnae.setValue( resource )
    this.febCnae.setValue( resource )
    this.marCnae.setValue( resource )
    this.aprCnae.setValue( resource )

    this.mayCnae.setValue( resource )
    this.junCnae.setValue( resource )
    this.julCnae.setValue( resource )
    this.augCnae.setValue( resource )

    this.sepCnae.setValue( resource )
    this.octCnae.setValue( resource )
    this.novCnae.setValue( resource )
    this.decCnae.setValue( resource )
  }

  public copyBillingMonthValue( resource: string ) {
    this.genBill.setValue( resource )
    this.febBill.setValue( resource )
    this.marBill.setValue( resource )
    this.aprBill.setValue( resource )

    this.mayBill.setValue( resource )
    this.junBill.setValue( resource )
    this.julBill.setValue( resource )
    this.augBill.setValue( resource )

    this.sepBill.setValue( resource )
    this.octBill.setValue( resource )
    this.novBill.setValue( resource )
    this.decBill.setValue( resource )
  }


}
