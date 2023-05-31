import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from 'src/app/services';
import { Icons, PubSubUtil } from 'src/app/util';
import { defaultNavItems } from '../../../util/constants';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { NavItemsComponent } from '../nav-items/nav-items.component';

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
  get navItems() {
    return defaultNavItems.filter((item) => this.authService.hasRoles(item.roles));
  }

  hovering = false;

  Icons = Icons;

  isMobile$ = PubSubUtil.isMobile$();

  constructor(private authService: AuthService) {}
}
