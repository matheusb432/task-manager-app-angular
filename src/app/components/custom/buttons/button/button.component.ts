import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() color: ThemePalette = 'primary';
  @Input() type = 'button';
  @Input() label = '';
  @Input() styleClass = '';

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
}
