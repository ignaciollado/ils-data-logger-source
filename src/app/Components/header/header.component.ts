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
  showAuthSection: boolean
  showNoAuthSection: boolean
  isCompany: boolean
  
  userId: string = ""
  access_token: string | null

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService
  ) {
    this.access_token = sessionStorage.getItem("access_token")
    this.showAuthSection = false;
    this.showNoAuthSection = true;

    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, showAdminSection: false, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {  showAuthSection: true, showNoAuthSection: false, showAdminSection: false,}
        this.headerMenusService.headerManagement.next(headerInfo)
        this.userId = this.jwtHelper.decodeToken().name
      } else { /* logout */
        const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, showAdminSection: false, }
        sessionStorage.removeItem('user_id')
        sessionStorage.removeItem('access_token')
        this.headerMenusService.headerManagement.next(headerInfo)
        this.userId = ""
        this.router.navigateByUrl('login')
      }
    }
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe (
      (headerInfo: HeaderMenus) => {
        if (this.jwtHelper.decodeToken()) {
          if (this.jwtHelper.decodeToken().role == 'company') {
           this.isCompany = true
          } else {
            this.isCompany = false
          }
        }

        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection
          this.showNoAuthSection = headerInfo.showNoAuthSection
        }
      }
    )
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, showAdminSection: false};
    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('login')
  }

  register(): void {
    this.router.navigateByUrl('register')
  }

  listUsers(): void {
    this.router.navigateByUrl('listUsers')
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts')
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories')
  }

  adminConsumptions(): void {
    this.router.navigateByUrl('consumptions')
  }

  adminAspects(): void {
    this.router.navigateByUrl('aspects')
  }

  adminEnergies(): void {
    this.router.navigateByUrl('energies')
  }

  createUser(): void {
    this.router.navigateByUrl('register')
  }

  adminRatios(): void {
    this.router.navigateByUrl('adminRatios')
  }

  globalQuestionnaire(): void {
    this.router.navigateByUrl('global-questionnaire')
  }

  globalQuestionnaireNormative(): void {
    this.router.navigateByUrl('global-questionnaire-normative-texts')
  }

  municipalityQuestionnaireNormative(): void {
    this.router.navigateByUrl('municipality-questionnaire-normative-texts')
  }

  autoEvaluationQuestionnaire(): void {
    this.router.navigateByUrl('autoevaluation-questionnaire')
  }

  globalQuestionnaireList(): void {
    this.router.navigateByUrl('global-questionnaire-list')
  }

  myObjectives(): void {
    this.router.navigateByUrl('myObjectives')
  }


  profile(): void {
    this.router.navigateByUrl('profile')
  }

  logout(): void {
    this.router.navigateByUrl('home')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('access_token')
    this.userId = ""
    this.isCompany = false
    /* location.reload() */
    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, }
    this.headerMenusService.headerManagement.next(headerInfo)
  }
}
