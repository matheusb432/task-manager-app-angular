import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HomeModule } from './pages/home/home.module';
import { PageModule } from './shared';
import { NavItemsComponent } from './components/custom/nav-items/nav-items.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HomeModule,
    PageModule,
    AppRoutingModule,
  ],
  exports: [PageModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
