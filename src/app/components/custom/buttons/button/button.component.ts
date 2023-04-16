import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() color: ThemePalette = 'primary';
  @Input() type: string = 'button';
  @Input() label: string = '';
  @Input() styleClass: string = '';

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
}
