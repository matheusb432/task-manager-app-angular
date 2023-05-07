import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services';
import { PubSubUtil } from 'src/app/util';
import { LoadingComponent } from '../../loading/loading.component';
import { NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { validationErrorMessages } from '../validation-errors';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
export class DatepickerComponent implements OnChanges, OnDestroy {
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

  subscriptions: Subscription[] = [];

  get invalid(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  constructor(private loadingService: LoadingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit']) {
      this.changeControlEnabled();
    }
  }

  ngOnDestroy(): void {
    PubSubUtil.unsub(this.subscriptions);
  }

  initLoadingSubscription(): void {
    PubSubUtil.unsub(this.subscriptions);
    const loadingSub = this.loadingService
      .isAnyLoadingPipeFactory([this.elId, this.formId])
      .subscribe((isLoading) => {
        this.isLoading = isLoading;

        this.changeControlEnabled();
      });

    this.subscriptions = [loadingSub];
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
