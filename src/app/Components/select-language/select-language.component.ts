import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-select-language',
  template: `<mat-button-toggle-group name="selectLanguage" aria-label="Please, select your preferred language">
                  <mat-button-toggle #langSelect (click)="switchLanguage('cat')">cat</mat-button-toggle>
                  <mat-button-toggle #langSelect (click)="switchLanguage('cas')">cas</mat-button-toggle>
                  <mat-button-toggle #langSelect (click)="switchLanguage('en')">eng</mat-button-toggle>
              </mat-button-toggle-group>`,
  styles: [`
    select:hover, option:hover {
      cursor: pointer;
      color: #fff;
      background-color: #a3d4da;
    }
    `
  ]
})
export class SelectLanguageComponent implements OnInit {

  constructor(public translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  switchLanguage( lang:string ) {
    this.translate.use(lang)
    localStorage.setItem('preferredLang', lang)
    location.reload()
  }

}
