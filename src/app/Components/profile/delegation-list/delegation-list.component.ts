import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DelegationDTO } from 'src/app/Models/delegation.dto';
import { deleteResponse } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { DelegationService } from 'src/app/Services/delegation.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation-list.component.html',
  styleUrls: ['./delegation-list.component.scss']
})
export class DelegationListComponent {
  delegations!: DelegationDTO[];

  isGridView: boolean = false
  columnsDisplayed = ['name', 'address', 'ACTIONS'];

  constructor(
    private delegationService: DelegationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
  ) {

    this.loadDelegations();
  }

  private loadDelegations(): void {
    let errorResponse: any;
    const companyId = this.localStorageService.get('user_id');
    if (companyId) {

        this.delegationService.getAllDelegationsByCompanyIdFromMySQL(companyId).subscribe(
        (delegations: DelegationDTO[]) => {
          this.delegations = delegations
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
    let result = confirm('Confirm delete this delegation with id: ' + companyDelegationId + ' .');
    if (result) {
      this.delegationService.deleteDelegation(companyDelegationId).subscribe(
        (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadDelegations();
          }
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

}
