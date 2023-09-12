import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  displayLanguageSelect:Boolean = true
 
  constructor(public translate: TranslateService) {

  }

  ngOnInit(): void {
    if (localStorage.getItem("preferredLang")!= 'cas' && localStorage.getItem("preferredLang")!= 'cat') {
      this.displayLanguageSelect = true
    } else {
      this.displayLanguageSelect = false
    }
    console.log (this.displayLanguageSelect, localStorage.getItem("preferredLang"))
  }

  switchLanguage( lang:string ) {
    this.translate.use(lang)
    localStorage.setItem('preferredLang', lang)
    this.displayLanguageSelect = false
    location.reload()
  }

}
