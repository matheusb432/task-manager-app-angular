import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '../components/custom/card/card.component';
import { ImageComponent } from '../components/custom/image/image.component';
import { MainHeaderComponent } from '../components/custom/main-header/main-header.component';
import { SidebarComponent } from '../components/custom/sidebar/sidebar.component';
import { TitleComponent } from '../components/custom/title/title.component';
import { CardLayoutComponent } from '../components/layout/card-layout/card-layout.component';
import { GridLayoutComponent } from './../components/layout/grid-layout/grid-layout.component';
import { PageLayoutComponent } from './../components/layout/page-layout/page-layout.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { RouterModule } from '@angular/router';
import { CardsGridComponent } from '../components/custom/cards-grid/cards-grid.component';
import { NavItemsComponent } from '../components/custom/nav-items/nav-items.component';
import { ButtonComponent } from '../components/custom/buttons/button/button.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    ButtonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
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
    ButtonComponent,
    MatSidenavModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PageModule {}
