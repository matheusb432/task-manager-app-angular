import { GridLayoutComponent } from './../components/layout/grid-layout/grid-layout.component';
import { PageLayoutComponent } from './../components/layout/page-layout/page-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SidebarComponent } from '../components/custom/sidebar/sidebar.component';
import { MainHeaderComponent } from '../components/custom/main-header/main-header.component';
import { TitleComponent } from '../components/custom/title/title.component';
import { CardComponent } from '../components/custom/card/card.component';
import { ImageComponent } from '../components/custom/image/image.component';
import { CardLayoutComponent } from '../components/layout/card-layout/card-layout.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsGridComponent } from '../components/custom/cards-grid/cards-grid.component';
import { NavItemsComponent } from '../components/custom/nav-items/nav-items.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    CardLayoutComponent,
    ImageComponent,
    GridLayoutComponent,
    CardsGridComponent,
    NavItemsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatGridListModule,
    NgOptimizedImage,
  ],
  exports: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    CardLayoutComponent,
    ImageComponent,
    GridLayoutComponent,
    CardsGridComponent,
    NavItemsComponent,
    MatSidenavModule,
    MatGridListModule,
  ],
})
export class PageModule {}
