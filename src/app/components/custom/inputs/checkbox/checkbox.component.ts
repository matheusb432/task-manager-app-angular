import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-checkbox [fcName] [control] [fg] [labelText]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatCheckboxModule],
})
export class CheckboxComponent implements OnChanges {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;

  @Output() changed = new EventEmitter<boolean>();

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] || changes['canEdit']) this.changeControlEnabled();
  }

  changeControlEnabled(): void {
    if (this.canEdit) this.control?.enable();
    else this.control?.disable();
  }

  onChange(event: MatCheckboxChange): void {
    this.changed.emit(event.checked);
  }
}
