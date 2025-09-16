import { Component } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { UserDTO, userColumns } from 'src/app/Models/user.dto';
import { UserService } from 'src/app/Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatTableDataSource  } from '@angular/material/table';
import { MatPaginator  } from '@angular/material/paginator';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent {
  isLoading: boolean = true;
  user: UserDTO
  users!: UserDTO[]
  private userId: string | null
  isGridView: boolean = false
  access_token: string | null
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  dataSource = new MatTableDataSource<UserDTO>()
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  columnsDisplayed: string[] = userColumns.map((col) => col.key)
  columnsSchema: any = userColumns

  valid: any = {}

constructor(
  private userService: UserService,
  private sharedService: SharedService,
  private router: Router,
  private headerMenusService: HeaderMenusService,
  private jwtHelper: JwtHelperService,
  public dialog: MatDialog
){
  this.access_token = sessionStorage.getItem("access_token")
  this.showAuthSection = false
  this.showNoAuthSection = true

  if (this.access_token === null) {
    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, }
    this.headerMenusService.headerManagement.next(headerInfo)
  } else {
    if (!this.jwtHelper.isTokenExpired (this.access_token)) {
      const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, }
      this.headerMenusService.headerManagement.next(headerInfo)
      this.userId = this.jwtHelper.decodeToken().id_ils
      this.loadUsers(this.userId);
    } else {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      sessionStorage.removeItem('user_id')
      sessionStorage.removeItem('access_token')
      this.headerMenusService.headerManagement.next(headerInfo)
      this.router.navigateByUrl('login')
    }
  }
}

ngOnInit(): void { 

}

private loadUsers(userId: string): void {
  let errorResponse: any;
  if (userId) {
      this.userService.getAllRegisteredUsers().subscribe(
      (users: any[]) => {
        this.users = users
        this.sharedService.showSnackBar("retrieved")
        this.dataSource.data = this.users;
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: HttpErrorResponse) => {
        errorResponse = error.error
        this.sharedService.errorLog(errorResponse)
      }
    );
  }
}


public removeRow(id: any) {
  this.userService.deleteUser(id).subscribe(() => {
   this.dataSource.data = this.dataSource.data.filter(
     (u: UserDTO) => u.id !== id
   );
 });
}

public editRow(row: UserDTO) {
  let responseOK: boolean = false;
  let errorResponse: any;

  if (row.id === '0') {
    this.userService.updateUserPindustExpedientes(row.id, row)
    .pipe(
      finalize(async () => {
        await this.sharedService.managementToast(
          'postFeedback',
          responseOK,
          errorResponse
        );
      })
    )
    .subscribe((newUser: UserDTO) => {
      row.id = newUser.id
      row.isEdit = false
      this.loadUsers(this.userId)
    });
  } else {
    this.userService.updateUserPindustExpedientes(row.id, row).subscribe(() => {
      row.isEdit = false
      this.loadUsers(this.userId)
    })
  }
  row.isEdit = false
}

}
