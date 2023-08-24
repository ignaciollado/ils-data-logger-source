import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [TranslateModule]
})
export class I18nModule {
  constructor(translate: TranslateService) {

    translate.addLangs(['cat', 'cas']) /* Indica que lenguas hay disponibles para la traducción */
    // translate.setDefaultLang('cat') /* Lengua por defecto cuando no se encuentre un JSON de traducción */
    const browserLang = translate.getBrowserLang()

    if (localStorage.getItem('preferredLang') === null) {
      localStorage.setItem('preferredLang', translate.defaultLang)
    }
    // translate.use(translate.getLangs().includes(browserLang) ? browserLang : 'ca')  /* Usar el idioma del navegador */
    translate.use(localStorage.getItem('preferredLang')) /* Usar el idioma preferido del usuario */

  }
}

export function translateLoaderFactory( httpClient: HttpClient ) {
  return new TranslateHttpLoader(httpClient);
}