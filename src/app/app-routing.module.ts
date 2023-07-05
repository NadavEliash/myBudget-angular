import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinistryIndexComponent } from './pages/ministry-index/ministry-index.component';
import { MinistryDetailsComponent } from './pages/ministry-details/ministry-details.component';
import { MinistryEditComponent } from './pages/ministry-edit/ministry-edit.component';
import { HomeComponent } from './pages/home/home.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'ministry',
    component: MinistryIndexComponent
  },
  {
    path: 'ministry/:id',
    component: MinistryDetailsComponent
  },
  {
    path: 'edit',
    component: MinistryEditComponent
  },
  {
    path: 'edit/:id',
    component: MinistryEditComponent
  },
  {
    path: 'charts',
    component: ChartsComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }