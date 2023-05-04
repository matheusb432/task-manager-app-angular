import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-icon [icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() icon!: Icons;
  @Input() color: ThemePalette = 'primary';
  @Input() ariaLabelText = 'Icon';
  @Input() url?: string;
  @Input() size = 24;
  @Input() clickable = false;
  @Input() queryParams?: Record<string, string>;
  @Input() title = '';
  @Input() elId = '';

  @Output() clicked = new EventEmitter<void>();
}
