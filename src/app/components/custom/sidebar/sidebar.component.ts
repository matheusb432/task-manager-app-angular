import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icons, PubSubUtil } from 'src/app/util';
import { defaultNavItems } from './../../../util/constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  navItems = defaultNavItems;

  hovering = false;

  Icons = Icons;

  isMobile$ = PubSubUtil.isMobile$();
}
