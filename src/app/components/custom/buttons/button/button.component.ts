import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() color: string = 'primary';
  @Input() type: string = 'button';
  @Input() label: string = '';
  @Input() styleClass: string = '';

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
}
