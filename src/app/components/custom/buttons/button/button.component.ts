import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { us } from 'src/app/helpers';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() color: ThemePalette = 'primary';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() url?: string;
  @Input() model: 'raised' | 'stroked' | 'flat' | 'icon' | 'fab' | 'mini-fab' | 'link' | '' = '';
  @Input() elId?: string;

  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  emitClick = (): void => this.clicked.emit();
}
