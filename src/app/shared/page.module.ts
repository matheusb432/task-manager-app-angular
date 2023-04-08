import { PageLayoutComponent } from './../components/layout/page-layout/page-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/custom/sidebar/sidebar.component';
import { MainHeaderComponent } from '../components/custom/main-header/main-header.component';

@NgModule({
  declarations: [SidebarComponent, PageLayoutComponent, MainHeaderComponent],
  imports: [CommonModule],
  exports: [SidebarComponent, PageLayoutComponent, MainHeaderComponent],
})
export class PageModule {}
