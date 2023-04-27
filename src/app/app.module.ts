import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgOptimizedImage } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HomeModule } from './pages/home/home.module';
import { PageModule } from './shared';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { STORE_SERVICE } from './services/base';
import { LocalStorageService } from './services';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
    PageModule,
    AppRoutingModule,
    HttpClientModule,
    NgOptimizedImage,
  ],
  exports: [PageModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: 'LOCALSTORAGE', useValue: window.localStorage },
    { provide: 'SESSIONSTORAGE', useValue: window.sessionStorage },
    { provide: STORE_SERVICE, useClass: LocalStorageService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
