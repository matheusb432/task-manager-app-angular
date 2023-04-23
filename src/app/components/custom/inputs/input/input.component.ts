import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input [fcName] [control] [fg] [labelText]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() type = 'text';
  @Input() helperText?: string;
  @Input() errText?: string;
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  getErrText(): string {
    const errors = this.control?.errors;

    if (errors == null) return this.errText || 'Invalid field';
    if (errors['required']) return 'This field is required';
    return 'Invalid input';
  }

  get invalid(): boolean {
    return this.isInvalid();
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }
}
