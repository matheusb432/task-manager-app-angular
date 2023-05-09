import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from '../components/custom/card/card.component';
import { ImageComponent } from '../components/custom/image/image.component';
import { MainHeaderComponent } from '../components/custom/main-header/main-header.component';
import { SidebarComponent } from '../components/custom/sidebar/sidebar.component';
import { TitleComponent } from '../components/custom/title/title.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../components/custom/buttons/button/button.component';
import { CardsGridComponent } from '../components/custom/cards-grid/cards-grid.component';
import { NavItemsComponent } from '../components/custom/nav-items/nav-items.component';

import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../components/custom/breadcrumb/breadcrumb.component';
import { IconComponent } from '../components/custom/icon/icon.component';
import { LoadingComponent } from '../components/custom/loading/loading.component';
import { ModalConfirmComponent, ModalFeedbackComponent } from '../components/custom/modals';
import { PaginationComponent } from '../components/custom/pagination/pagination.component';
import { TableComponent } from '../components/custom/table/table.component';
import { FocusInitialDirective, SetIdDirective, ScrollToDirective } from '../directives';
import { GetPipe, TimePipe } from '../pipes';
import { DynamicPipe } from '../pipes/dynamic.pipe';
import {
  CardLayoutComponent,
  FixedButtonsLayoutComponent,
  ModalLayoutComponent,
  PageLayoutComponent,
} from '../components/layout';

@NgModule({
  declarations: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    CardsGridComponent,
    NavItemsComponent,
    ButtonComponent,
    TableComponent,
    IconComponent,
    ModalLayoutComponent,
    ModalConfirmComponent,
    ModalFeedbackComponent,
    BreadcrumbComponent,
    PaginationComponent,
    FocusInitialDirective,
    SetIdDirective,
    DynamicPipe,
    TimePipe,
    GetPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    ImageComponent,
    CardLayoutComponent,
    LoadingComponent,
    FixedButtonsLayoutComponent,
    ScrollToDirective,
  ],
  exports: [
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    ImageComponent,
    CardsGridComponent,
    NavItemsComponent,
    ButtonComponent,
    TableComponent,
    IconComponent,
    ModalLayoutComponent,
    ModalConfirmComponent,
    ModalFeedbackComponent,
    BreadcrumbComponent,
    PaginationComponent,
    MatSidenavModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    LoadingComponent,
    FixedButtonsLayoutComponent,
    FocusInitialDirective,
    SetIdDirective,
    ScrollToDirective,
    ReactiveFormsModule,
    DynamicPipe,
    TimePipe,
    GetPipe,
  ],
  providers: [DynamicPipe, TimePipe, GetPipe, DatePipe, DecimalPipe],
})
export class PageModule {}
