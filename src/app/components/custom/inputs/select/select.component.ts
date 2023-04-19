import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/models/configs';

@Component({
  selector: 'app-select [fcName] [control] [fg] [labelText] [options]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() options!: SelectOption[];
  @Input() placeholder = '';
  @Input() invalid?: boolean;
  @Input() helperText?: string;
  @Input() errText?: string;
  @Input() multiple?: boolean = false;
  @Input() compareWithFn: (o1: unknown, o2: unknown) => boolean = (o1: unknown, o2: unknown) =>
    o1 === o2;

  getErrText(): string {
    const errors = this.control?.errors;

    if (errors == null) return this.errText || 'Invalid field';
    if (errors['required']) return 'This field is required';
    return 'Invalid input';
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }
}
