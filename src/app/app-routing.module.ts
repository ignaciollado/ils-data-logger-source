import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthGuard } from './Guards/auth.guard';
import { DelegationFormComponent } from './Components/profile/delegation-form/delegation-form.component';
import { ResidueListComponent } from './Components/residues/residue-list/residue-list.component';
import { ResidueAdminFormComponent } from './Components/residues/residue-admin-form/residue-admin-form.component';
import { RatiosContainerComponent } from './Components/ratios/ratios-container/ratios-container.component';
import { ObjectivesComponent } from './Components/objectives/objectives.component';
import { ConsumptionContainerComponent } from './Components/posts/consumption-container/consumption-container.component';
import { GlobalRegulationQuestionnaireComponent } from './Components/global-regulation-questionnaire/global-regulation-questionnaire.component';
import { GlobalRegulationQuestionnaireListComponent } from './Components/global-regulation-questionnaire-list/global-regulation-questionnaire-list.component';
import { GlobalRegulationQuestionnaireAnswerComponent } from './Components/global-regulation-questionnaire-answer/global-regulation-questionnaire-answer.component';
import { GlobalRegulationQuestionnaireContinueComponent } from './Components/global-regulation-questionnaire-continue/global-regulation-questionnaire-continue.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { AutoevaluationQuestionnaireComponent } from './Components/autoevaluation-questionnaire/autoevaluation-questionnaire.component';
import { RegisteredUsersComponent } from './Components/register/registered-users/registered-users.component';
import { GlobalRegulationNormativeTextsComponent } from './global-regulation-normative-texts/global-regulation-normative-texts.component';
import { MunicipalityRegulationNormativeTextsComponent } from './municipality-regulation-normative-texts/municipality-regulation-normative-texts.component';
import { PasswordRecoveryComponent } from './Components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './Components/password-reset/password-reset.component';
import { ChapterListComponent } from './Components/residues/chapter-list/chapter-list.component';
import { SubchapterListComponent } from './Components/residues/subchapter-list/subchapter-list.component';
import { ItemListComponent } from './Components/residues/item-list/item-list.component';
import { GraphContainerComponent } from './Components/dashboard/graph-container/graph-container.component';
import { IlsCnaeActivityEmissionInidicatorComponent } from './Components/ils-cnae-activity-emission-indicator/list/list.component';
import { EditIlsCnaeActivityEmissionInidicatorComponent } from './Components/ils-cnae-activity-emission-indicator/edit/edit.component';
import { EnergyListComponent } from './Components/energy-management/energy-list/energy-list.component';
import { EnergyFormComponent } from './Components/energy-management/energy-form/energy-form.component';
import { TestEndPointsBackendComponent } from './management/test-end-points-backend/test-end-points-backend.component';
import { VectorsComponent } from './Components/questionnaire-management/vectors/vectors.component';
import { QuestionsComponent } from './Components/questionnaire-management/questions/questions.component';
import { AnswersComponent } from './Components/questionnaire-management/answers/answers.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test-end-point', component: TestEndPointsBackendComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover-password', component: PasswordRecoveryComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'listUsers', component: RegisteredUsersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: GraphContainerComponent },
  { path: 'consumptions', component: ConsumptionContainerComponent, canActivate: [AuthGuard] },
  { path: 'user/consumption/:id', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'user/consumption', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'adminRatios', component: RatiosContainerComponent, canActivate: [AuthGuard] },
  { path: 'myObjectives', component: ObjectivesComponent, canActivate: [AuthGuard] },
  { path: 'user/delegation', component: DelegationFormComponent, canActivate: [AuthGuard] },
  { path: 'residues', component: ResidueListComponent, canActivate: [AuthGuard], },
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
    path: 'global-questionnaire-normative-texts',
    title: 'ILS- Mantenimiento de textos normativos',
    component: GlobalRegulationNormativeTextsComponent
  },
  {
    path: 'municipality-questionnaire-normative-texts',
    title: 'ILS- Mantenimiento de ordenanzas municipales',
    component: MunicipalityRegulationNormativeTextsComponent
  },
  {
    path: 'global-questionnaire-list',
    title: 'ILS-Auditorías ambientales',
    component: GlobalRegulationQuestionnaireListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'autoevaluation-questionnaire/:id',
    title: 'ILS-Formulario de autoevaluación',
    component: AutoevaluationQuestionnaireComponent,
    canActivate: [AuthGuard]
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

  { path: 'chapters', component: ChapterListComponent, canActivate: [AuthGuard], },
  { path: 'subchapters', component: SubchapterListComponent, canActivate: [AuthGuard], },
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard], },

  { path: 'activity-emissions-cnae', component: IlsCnaeActivityEmissionInidicatorComponent, canActivate: [AuthGuard], },
  { path: 'edit-activity-emissions-cnae/:id', component: EditIlsCnaeActivityEmissionInidicatorComponent, canActivate: [AuthGuard], },

  { path: 'energy', component: EnergyListComponent, canActivate: [AuthGuard] },
  { path: 'energy/new', component: EnergyFormComponent, canActivate: [AuthGuard] },
  { path: 'energy/:id', component: EnergyFormComponent, canActivate: [AuthGuard] },

  { path: 'vectors', component: VectorsComponent, canActivate: [AuthGuard] },
  { path: 'questions', component: QuestionsComponent, canActivate: [AuthGuard] },
  { path: 'answers', component: AnswersComponent, canActivate: [AuthGuard] },

  { path: '*', component: HomeComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
