import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../loading/loading.component';
import { PubSubUtil } from 'src/app/util';
import { LoadingService } from 'src/app/services';
import { Subscription } from 'rxjs';
import { IconConfig } from 'src/app/models';
import { validationErrorMessages } from '../validation-errors';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, LoadingComponent],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent implements OnChanges, OnDestroy {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() errText?: string;
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() formId = '';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  isLoading = false;

  subscriptions: Subscription[] = [];

  get invalid(): boolean {
    return this.isInvalid();
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
