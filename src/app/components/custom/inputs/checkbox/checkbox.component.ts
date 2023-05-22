import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-checkbox [fcName] [fg] [labelText]',
  template: `<div [formGroup]="fg">
    <mat-checkbox
      [formControlName]="fcName"
      [id]="elId"
      color="primary"
      (change)="onChange($event)"
    >
      {{ labelText }}
    </mat-checkbox>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatCheckboxModule],
})
export class CheckboxComponent implements OnChanges {
  @Input() fcName!: string;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;

  @Output() changed = new EventEmitter<boolean>();

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get control(): AbstractControl | null {
    return this.fg.get(this.fcName);
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
