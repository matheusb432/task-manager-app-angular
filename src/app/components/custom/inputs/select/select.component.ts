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
  @Input() control!: AbstractControl;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() options!: SelectOption[];
  @Input() placeholder = '';
  @Input() invalid?: boolean;
  @Input() helperText?: string;
  @Input() errText?: string;
  @Input() multiple?: boolean = false;
  @Input() compareWithFn: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2;

  constructor() {}

  ngOnInit() {}

  getErrText(): string {
    const errors = this.control.errors;

    if (errors == null) return this.errText || 'Invalid field';
    if (errors['required']) return 'This field is required';
    return 'Invalid input';
  }
}
