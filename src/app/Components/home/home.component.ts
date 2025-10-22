import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WPpageService } from 'src/app/Services/wp-page.service';
import { WpPage } from 'src/app/Models/wp-page-data.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  lang: string = 'cat'; // valor por defecto
  showButtons: boolean;
  access_token: string | null;
  userId: string | null;
  introTitle: string
  introText: string
  publishedIntro: boolean
  idIntroText: string = '1129'

  constructor(
    private router: Router, private wpPageService: WPpageService,
    private headerMenusService: HeaderMenusService, private route: ActivatedRoute, private translate: TranslateService,
    private jwtHelper: JwtHelperService
  ) {
    this.showButtons = false
    this.access_token = sessionStorage.getItem("access_token")
    sessionStorage.removeItem("preferredLang")
    if (this.access_token === null) {
      const headerInfo: HeaderMenus = { showAuthSection: false, showNoAuthSection: true, };
      this.headerMenusService.headerManagement.next(headerInfo)
    } else {
      if (!this.jwtHelper.isTokenExpired (this.access_token)) {
        const headerInfo: HeaderMenus = {  showAuthSection: true, showNoAuthSection: false, };
        this.headerMenusService.headerManagement.next(headerInfo)
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
     this.route.queryParams.subscribe(params => {
      const langParam = params['lang'];
      if(langParam) {
        this.lang = langParam;
        this.translate.use(this.lang);
        if (this.lang === 'cas') {
          this.idIntroText = '1127'
          this.getHomeIntroText(this.idIntroText)
        } else {
          this.idIntroText = '1129'
          this.getHomeIntroText(this.idIntroText)
        }
      }
    });

    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  getHomeIntroText(id:string) {
    this.wpPageService.get(id)
      .subscribe((introPage: WpPage) => {
        this.publishedIntro = introPage.status === 'publish';
        this.introText = introPage.content.rendered
      })
  }
}
