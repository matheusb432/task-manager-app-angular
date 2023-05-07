import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconConfig } from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { validationErrorMessages } from '../validation-errors';
import { PubSubUtil } from 'src/app/util';

@Component({
  selector: 'app-input [fcName] [control] [fg] [labelText]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() labelIcon?: IconConfig<never>;
  @Input() type = 'text';
  @Input() helpers?: string[];
  @Input() errText?: string;
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() formId = '';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  @Output() keydownPressed = new EventEmitter<KeyboardEvent>();

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
