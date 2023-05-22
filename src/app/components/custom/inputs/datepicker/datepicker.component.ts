import { DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { Nullish, WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-datepicker [fcName] [fg] [labelText]',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    LoadingComponent,
    DatePipe,
  ],
})
export class DatepickerComponent extends WithDestroyed implements OnChanges, OnDestroy {
  @Input() fcName!: string;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() formId = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() dateFilterFn: DateFilterFn<Date | undefined> | Nullish;

  isLoading = false;

  get invalid(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get control(): AbstractControl | null {
    return this.fg.get(this.fcName);
  }

  constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit']) {
      this.changeControlEnabled();
    }
  }

  initLoadingSubscription(): void {
    this.loadingService
      .isLoadingByIds$([this.elId, this.formId])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;

        this.changeControlEnabled();
        this.cdRef.detectChanges();
      });
  }

  changeControlEnabled(): void {
    if (!this.isLoading && this.canEdit) this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    return 'Invalid date!';
  }

  dateFilter: DateFilterFn<Date | Nullish> = (d) => {
    if (!this.dateFilterFn) return true;
    return this.dateFilterFn(d);
  };
}
