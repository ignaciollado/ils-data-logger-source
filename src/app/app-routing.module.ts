import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { PostsListComponent } from './Components/posts/posts-list/posts-list.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthGuard } from './Guards/auth.guard';


import { DelegationFormComponent } from './Components/profile/delegation-form/delegation-form.component';

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
    component: PostsListComponent,
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
    path: 'user/delegation',
    component: DelegationFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuels',
    component: CategoriesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
