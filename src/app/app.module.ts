import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { I18nModule } from "./i18n/i18n.module";

import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { PostsListComponent } from './Components/posts/posts-list/posts-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { FormatDatePipe } from './Pipes/format-date.pipe';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import { DelegationListComponent } from './Components/profile/delegation-list/delegation-list.component';
import { DelegationFormComponent } from './Components/profile/delegation-form/delegation-form.component';
import { WaterFormComponent } from './Components/posts/water-form/water-form.component';
import { ResidueFormComponent } from './Components/posts/residue-form/residue-form.component';
import { EmissionFormComponent } from './Components/posts/emission-form/emission-form.component';
import { AspectFormComponent } from './Components/aspects/aspect-form/aspect-form.component';
import { AspectListComponent } from './Components/aspects/aspect-list/aspect-list.component';
import { EnergyFormComponent } from './Components/energies/energy-form/energy-form.component';
import { EnergyListComponent } from './Components/energies/energy-list/energy-list.component';
import { ResidueListComponent } from './Components/residues/residue-list/residue-list.component';
import { ResidueAdminFormComponent } from './Components/residues/residue-admin-form/residue-admin-form.component';
import { SelectLanguageComponent } from './Components/select-language/select-language.component';
import { ModalComponent } from './Components/modal/modal.component';
import { PersonsComponent } from './Components/ratios/persons/persons.component';
import { BillingComponent } from './Components/ratios/billing/billing.component';
import { RatiosContainerComponent } from './Components/ratios/ratios-container/ratios-container.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

export function tokenGetter() {
  return sessionStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    PostsListComponent,
    PostFormComponent,
    CategoryFormComponent,
    CategoriesListComponent,
    FormatDatePipe,
    DashboardComponent,
    DelegationListComponent,
    DelegationFormComponent,
    WaterFormComponent,
    ResidueFormComponent,
    EmissionFormComponent,
    AspectFormComponent,
    AspectListComponent,
    EnergyFormComponent,
    EnergyListComponent,
    ResidueListComponent,
    ResidueAdminFormComponent,
    SelectLanguageComponent,
    ModalComponent,
    PersonsComponent,
    BillingComponent,
    RatiosContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    I18nModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["datalogger.industrialocalsostenible.com", "jwt.idi.es"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonToggleModule,
    MatCardModule,
    MatGridListModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

