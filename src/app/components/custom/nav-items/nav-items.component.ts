import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavItem } from 'src/app/models';

@Component({
  selector: 'app-nav-items [items]',
  templateUrl: './nav-items.component.html',
  styleUrls: ['./nav-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemsComponent {
  @Input() items!: NavItem[];
  @Input() iconOnly = false;
}
