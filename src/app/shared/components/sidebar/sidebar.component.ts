import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icons, PubSubUtil } from 'src/app/util';
import { defaultNavItems } from '../../../util/constants';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { NavItemsComponent } from '../nav-items/nav-items.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    NgIf,
    NavItemsComponent,
    MainHeaderComponent,
    FooterNavComponent,
    AsyncPipe,
  ],
})
export class SidebarComponent {
  navItems = defaultNavItems;

  hovering = false;

  Icons = Icons;

  isMobile$ = PubSubUtil.isMobile$();
}
