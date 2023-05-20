import { IconComponent } from 'src/app/components/custom/icon/icon.component';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../buttons/button/button.component';
import { Icons } from 'src/app/util';

@Component({
  selector: 'app-icon-button [icon] [iconSize]',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  template: `
    <app-button
      model="icon"
      [styles]="getButtonStyles()"
      [title]="title"
      [disabled]="disabled"
      (clicked)="clicked.emit($event)"
    >
      <app-icon [icon]="icon" [styles]="styles" [size]="iconSize"></app-icon>
    </app-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  @Input() icon!: Icons;
  @Input() iconSize!: number;
  @Input() styles: Record<string, string> = {};
  @Input() title = '';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  get buttonSize(): number {
    return this.iconSize * 1.4;
  }

  getButtonStyles(): Record<string, string> {
    return {
      width: `${this.buttonSize}px`,
      height: `${this.buttonSize}px`,
      ...this.styles,
    };
  }
}
