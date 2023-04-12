import { Component, Input } from '@angular/core';
import { NavItem } from 'src/app/models/configs';

@Component({
  selector: 'app-nav-items [items]',
  templateUrl: './nav-items.component.html',
  styleUrls: ['./nav-items.component.scss']
})
export class NavItemsComponent {
  @Input() items!: NavItem[];
}
