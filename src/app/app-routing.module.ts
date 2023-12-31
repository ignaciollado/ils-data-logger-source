import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthGuard } from './Guards/auth.guard';
import { DelegationFormComponent } from './Components/profile/delegation-form/delegation-form.component';
import { AspectListComponent } from './Components/aspects/aspect-list/aspect-list.component';
import { EnergyListComponent } from './Components/energies/energy-list/energy-list.component';
import { ResidueListComponent } from './Components/residues/residue-list/residue-list.component';
import { AspectFormComponent } from './Components/aspects/aspect-form/aspect-form.component';
import { EnergyFormComponent } from './Components/energies/energy-form/energy-form.component';
import { ResidueAdminFormComponent } from './Components/residues/residue-admin-form/residue-admin-form.component';
import { RatiosContainerComponent } from './Components/ratios/ratios-container/ratios-container.component';
import { ObjectivesComponent } from './Components/objectives/objectives.component';
import { ConsumptionContainerComponent } from './Components/posts/consumption-container/consumption-container.component';
import { GlobalRegulationQuestionnaireComponent } from './Components/global-regulation-questionnaire/global-regulation-questionnaire.component';
import { GlobalRegulationQuestionnaireListComponent } from './Components/global-regulation-questionnaire-list/global-regulation-questionnaire-list.component';
import { GlobalRegulationQuestionnaireAnswerComponent } from './Components/global-regulation-questionnaire-answer/global-regulation-questionnaire-answer.component';
import { GlobalRegulationQuestionnaireContinueComponent } from './Components/global-regulation-questionnaire-continue/global-regulation-questionnaire-continue.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'categories',
    component: CategoriesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/category/:id',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'consumptions',
    component: ConsumptionContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/consumption/:id',
    component: PostFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/consumption',
    component: PostFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminRatios',
    component: RatiosContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'myObjectives',
    component: ObjectivesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/delegation',
    component: DelegationFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'energies',
    component: EnergyListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createEnergy',
    component: EnergyFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'aspects',
    component: AspectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createAspect',
    component: AspectFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'residues',
    component: ResidueListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createResidue',
    component: ResidueAdminFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'global-questionnaire',
    title: 'ILS-Auditorías ambientales',
    component: GlobalRegulationQuestionnaireComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'global-questionnaire-list',
    title: 'ILS-Auditorías ambientales',
    component: GlobalRegulationQuestionnaireListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'global-questionnaire-continue/:id',
    title: 'ILS-Auditorías ambientales',
    component: GlobalRegulationQuestionnaireContinueComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questionnaire-detail/:id',
    title: 'ILS-Auditorías ambientales',
    component: GlobalRegulationQuestionnaireAnswerComponent,
    canActivate: [AuthGuard],
  },
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
