import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import jwtDecode from 'jwt-decode';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LocalStorageService } from './services';
import { STORE_SERVICE } from './services/interfaces';
import { TOKEN_DECODER_FN } from './services/token.service';
import { PageModule } from './shared';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PageModule,
    AppRoutingModule,
    HttpClientModule,
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
