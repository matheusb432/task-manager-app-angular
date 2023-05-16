import { NgIf } from '@angular/common';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services';
import { LoadingComponent } from '../../loading/loading.component';
import { validationErrorMessages } from '../validation-errors';

@Component({
  selector: 'app-datepicker [fcName] [control] [fg] [labelText]',
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
  ],
})
export class DatepickerComponent extends WithDestroyed implements OnChanges, OnDestroy {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() formId = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  isLoading = false;

  get invalid(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
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
      .isAnyLoadingPipeFactory([this.elId, this.formId])
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
    const errorKeys = Object.keys(
      this.control?.errors ?? []
    ) as (keyof typeof validationErrorMessages)[];

    return validationErrorMessages[errorKeys[0]] || 'Invalid field';
  }
}
