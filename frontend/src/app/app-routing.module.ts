import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ApplicationComponent } from './application/application.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '',
    redirectTo: 'application',
    pathMatch: 'full' },

  { path: 'application',
    component: ApplicationComponent,
    loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule) },

  { path: 'login',
    component: LoginComponent },

  { path: 'not-found',
    component: PageNotFoundComponent },

  { path: '**',
    redirectTo: 'not-found' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
