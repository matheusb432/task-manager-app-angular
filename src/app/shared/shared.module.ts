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
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTooltipModule } from '@angular/material/tooltip';
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
import {
  CardLayoutComponent,
  FixedButtonsLayoutComponent,
  ModalLayoutComponent,
  PageLayoutComponent,
} from '../components/layout';
import { TimesheetSlideSpanComponent } from '../components/timesheet';
import { FocusInitialDirective, ScrollToDirective, SetIdDirective } from '../directives';
import { FinishedPipe, GetPipe, TimePipe } from '../pipes';
import { DynamicPipe } from '../pipes/dynamic.pipe';
import { FooterNavComponent } from '../components/custom/footer-nav/footer-nav.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule,
    ImageComponent,
    CardLayoutComponent,
    LoadingComponent,
    FixedButtonsLayoutComponent,
    TimesheetSlideSpanComponent,
    IconComponent,
    ButtonComponent,
    NavItemsComponent,
    FooterNavComponent,
    ScrollToDirective,
    SidebarComponent,
    PageLayoutComponent,
    MainHeaderComponent,
    TitleComponent,
    CardComponent,
    CardsGridComponent,
    TableComponent,
    ModalLayoutComponent,
    ModalConfirmComponent,
    ModalFeedbackComponent,
    BreadcrumbComponent,
    PaginationComponent,
    FocusInitialDirective,
    SetIdDirective,
    DynamicPipe,
    GetPipe,
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
    FooterNavComponent,
    TableComponent,
    ModalLayoutComponent,
    ModalConfirmComponent,
    ModalFeedbackComponent,
    BreadcrumbComponent,
    PaginationComponent,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule,
    LoadingComponent,
    FixedButtonsLayoutComponent,
    ButtonComponent,
    NavItemsComponent,
    FocusInitialDirective,
    SetIdDirective,
    ScrollToDirective,
    ReactiveFormsModule,
    DynamicPipe,
    GetPipe,
  ],
  providers: [DynamicPipe, TimePipe, FinishedPipe, GetPipe, DatePipe, DecimalPipe],
})
export class SharedModule {}
