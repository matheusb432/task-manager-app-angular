import jwtDecode from 'jwt-decode';
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
import { STORE_SERVICE } from './services/interfaces';
import { AuthService, LocalStorageService } from './services';
import { TOKEN_DECODER_FN } from './services/token.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: STORE_SERVICE, useClass: LocalStorageService },
    { provide: TOKEN_DECODER_FN, useValue: jwtDecode },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
