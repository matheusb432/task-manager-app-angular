import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input [fcName] [control] [fg]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() fcName!: string;

  @Input() control!: AbstractControl;

  @Input() type = 'text';

  @Input() styleClass = '';

  @Input() fg!: FormGroup;

  @Input() labelText?: string;

  @Input() helperText?: string;

  @Input() isRequired = false;

  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  invalidText = () => `${this.isRequired ? 'Required field' : 'Invalid field'}  | `;

  get invalid(): boolean {
    return this.isInvalid();
  }
}
