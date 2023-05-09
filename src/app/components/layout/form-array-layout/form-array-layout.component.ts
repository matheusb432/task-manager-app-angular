/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ul[app-form-array-layout] [titleText]',
  templateUrl: './form-array-layout.component.html',
  styleUrls: ['./form-array-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayLayoutComponent {
  @Input() titleText!: string;
  @Input() buttonId = '';
  @Input() showButtons = true;

  @Output() added = new EventEmitter<void>();
}
