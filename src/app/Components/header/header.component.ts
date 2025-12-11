import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean
  showNoAuthSection: boolean
  showAdminSection: boolean
  isCompany: boolean
  role: string = ""
  userId: string = ""
  access_token: string | null

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private jwtHelper: JwtHelperService,
    private cdr: ChangeDetectorRef
  ) {
    this.access_token = sessionStorage.getItem("access_token");
    this.showAuthSection = false
    this.showNoAuthSection = true
    this.showAdminSection = false

    if (this.access_token === null || this.jwtHelper.isTokenExpired(this.access_token)) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
        showAdminSection: false,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('access_token');
      this.headerMenusService.headerManagement.next(headerInfo);
      //this.router.navigateByUrl('login');
    } else {
      const decodedToken = this.jwtHelper.decodeToken(this.access_token)
      this.role = decodedToken.role
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
        showAdminSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
    }
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('access_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.role = sessionStorage.getItem('role'); // 👈 aquí se asigna el rol
    }
    if (this.access_token && !this.jwtHelper.isTokenExpired(this.access_token)) {
      const decodedToken = this.jwtHelper.decodeToken(this.access_token)
      this.role = sessionStorage.getItem('role')
      this.userId = decodedToken.name
      this.role = sessionStorage.getItem('role')
      this.isCompany = decodedToken.role === 'company'
      this.cdr.detectChanges(); // 👈 fuerza la actualización del template
    }

    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
          this.showAdminSection =
            this.isCompany = headerInfo.isCompany ?? true; // 👈 usa el valor recibido
          this.cdr.detectChanges();
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
    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, showAdminSection: false };
    this.headerMenusService.headerManagement.next(headerInfo);
    this.router.navigateByUrl('login')
  }

  register(): void {
    this.router.navigateByUrl('register')
  }

  listUsers(): void {
    this.router.navigateByUrl('listUsers')
  }

  listResidueChapters(): void {
    this.router.navigateByUrl('chapters')
  }

  energyMaintenance(): void {
    this.router.navigateByUrl('energy')
  }

  listActivityEmissionsCnae(): void {
    this.router.navigateByUrl('activity-emissions-cnae')
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
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('access_token')
    this.userId = ""
    this.isCompany = false
    const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, }
    this.headerMenusService.headerManagement.next(headerInfo)
    this.router.navigateByUrl('home')
  }

  viewVectors(): void {
    this.router.navigateByUrl('vectors')
  }

  viewQuestions(): void {
    this.router.navigate(['questions'])
  }

  viewAnswers(): void {

  }
}
