import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PageModule } from './shared';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TitleComponent } from './components/custom/title/title.component';
import { CardComponent } from './components/custom/card/card.component';
import { ImageComponent } from './components/custom/image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
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
