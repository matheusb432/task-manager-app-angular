import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input [fcName] [control] [fg]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() fcName!: string;

  @Input() control!: AbstractControl;

  @Input() type = 'text';

  @Input() fg!: FormGroup;

  @Input() labelText?: string;

  @Input() helperText?: string;

  @Input() errText?: string;

  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  getErrText = (): string => this.errText || 'Invalid field';

  get invalid(): boolean {
    console.log(this.control);
    if (!this.control) return false;

    console.warn(!!this.control, this.control.invalid, this.control.touched);
    return this.isInvalid();
  }
}
