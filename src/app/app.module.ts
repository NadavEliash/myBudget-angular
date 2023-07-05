import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-root/app.component';
import { HomeComponent } from './pages/home/home.component';
import { MinistryIndexComponent } from './pages/ministry-index/ministry-index.component';
import { MinistryDetailsComponent } from './pages/ministry-details/ministry-details.component';
import { MinistryEditComponent } from './pages/ministry-edit/ministry-edit.component';
import { MinistryFilterComponent } from './components/ministry-filter/ministry-filter.component';
import { MinistryListComponent } from './components/ministry-list/ministry-list.component';
import { MinistryPreviewComponent } from './components/ministry-preview/ministry-preview.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { SpendComponent } from './components/spend/spend.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MinistryIndexComponent,
    MinistryDetailsComponent,
    MinistryEditComponent,
    MinistryFilterComponent,
    MinistryListComponent,
    MinistryPreviewComponent,
    ChartsComponent,
    AppHeaderComponent,
    AppFooterComponent,
    LoginComponent,
    SpendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
