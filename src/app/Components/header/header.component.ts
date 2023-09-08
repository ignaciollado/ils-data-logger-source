import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  access_token: string | null;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService
  ) {
    this.access_token = sessionStorage.getItem("access_token")
    this.showAuthSection = false;
    this.showNoAuthSection = true;

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {  showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
      } else { /* logout */
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo)
        this.router.navigateByUrl('login')
      }
    }
  }

  ngOnInit(): void {

    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );

  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    const headerInfo: HeaderMenus = { showAuthSection: true, showNoAuthSection: false, };
    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  adminConsumptions(): void {
    this.router.navigateByUrl('consumptions');
  }

  adminAspects(): void {
    this.router.navigateByUrl('aspects');
  }

  adminEnergies(): void {
    this.router.navigateByUrl('energies');
  }

  adminResidues(): void {
    this.router.navigateByUrl('residues');
  }

  adminRatios(): void {
    this.router.navigateByUrl('adminRatios');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('access_token')

    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };

    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('login');
  }
}
