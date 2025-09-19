import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { deleteResponse } from 'src/app/Services/category.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { SharedService } from 'src/app/Services/shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.scss']
})
export class DelegationListComponent {
  delegations!: DelegationDTO[];
  hayDelegaciones: boolean = false
  isGridView: boolean = false
  columnsDisplayed = ['name', 'address', 'ACTIONS'];
  result: boolean = false
  private userId: string | null;

  constructor(
    private delegationService: DelegationService,
    private router: Router,
    private sharedService: SharedService,
    private jwtHelper: JwtHelperService,
  ) {
    this.userId = this.jwtHelper.decodeToken().id_ils
    this.loadDelegations();
  }

  private loadDelegations(): void {
    let errorResponse: any;

    if (this.userId) {

        /* this.delegationService.getAllDelegationsByCompanyIdFromMySQL(this.userId).subscribe( */
        this.delegationService.getTotalDelegationsByCompany(this.userId)
        .subscribe((delegations: any) => {
          if (delegations.delegationsCount === 0) {
            this.hayDelegaciones = false
          } else {
            this.hayDelegaciones = true
            this.delegationService.getAllDelegationsByCompanyIdFromMySQL(this.userId)
            .subscribe((delegations:DelegationDTO[]) => {
              this.delegations = delegations
            })
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
      );

    }
  }

  createDelegation(): void {
    this.router.navigateByUrl('/user/delegation');
  }

  deleteDelegation(companyDelegationId: string): void {
    let errorResponse: any;
    this.result = confirm('Confirm delete this delegation.');
    if (this.result) {
      this.delegationService.deleteDelegation(companyDelegationId).subscribe (
        (rowsAffected: deleteResponse) => {
          this.loadDelegations()
          if (rowsAffected.affected > 0) {}
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      )
      this.loadDelegations();
    }
  }

}
