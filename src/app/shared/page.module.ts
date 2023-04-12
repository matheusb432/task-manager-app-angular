import { PageLayoutComponent } from './../components/layout/page-layout/page-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/custom/sidebar/sidebar.component';
import { MainHeaderComponent } from '../components/custom/main-header/main-header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TitleComponent } from '../components/custom/title/title.component';
import { CardComponent } from '../components/custom/card/card.component';

@NgModule({
  declarations: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
  ],
  imports: [CommonModule, MatSidenavModule],
  exports: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    MatSidenavModule,
  ],
})
export class PageModule {}
