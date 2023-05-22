import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IconConfig } from 'src/app/models';
import { FormUtil, Icons } from 'src/app/util';

@Component({
  selector: 'app-search [fcName] [fg] [labelText]',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Input() fcName!: string;
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

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

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
