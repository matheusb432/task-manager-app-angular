import { Icons } from './../../../../utils/icons.enum';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IconConfig } from 'src/app/models/configs';

@Component({
  selector: 'app-search [fcName] [control] [fg] [labelText]',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() errText = 'Invalid Filter';
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  @Output() filter = new EventEmitter<string>();
  @Output() keydownPressed = new EventEmitter<KeyboardEvent>();
  @Output() apply = new EventEmitter<void>();

  searchIcon = IconConfig.withClick('cSearchIcon', Icons.Search, () => this.apply.emit());

  get invalid(): boolean {
    return this.isInvalid();
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  onKeydown(ev: KeyboardEvent): void {
    const searchValue = this.fg.controls[this.fcName].value.trim().toLowerCase();

    this.filter.emit(searchValue);
    this.keydownPressed.emit(ev);
    if (ev.code === 'Enter') this.apply.emit();
  }
}
