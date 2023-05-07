import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectOption } from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { validationErrorMessages } from '../validation-errors';
import { PubSubUtil, StringUtil } from 'src/app/util';

@Component({
  selector: 'app-select [fcName] [control] [fg] [labelText] [options]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() control!: AbstractControl | null;
  @Input() fg!: FormGroup;
  @Input() labelText!: string;
  @Input() options!: SelectOption[] | null;
  @Input() placeholder = '';
  @Input() invalid?: boolean;
  @Input() helpers?: string;
  @Input() errText?: string;
  @Input() multiple?: boolean = false;
  @Input() canEdit = true;
  @Input() elId = '';
  @Input() formId = '';
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() compareWithFn: (o1: unknown, o2: unknown) => boolean = (o1: unknown, o2: unknown) =>
    o1 === o2;

  isLoading = false;

  subscriptions: Subscription[] = [];

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  constructor(private loadingService: LoadingService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit'] || changes['options']) {
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
    if (!this.isLoading && StringUtil.notEmpty(this.options) && this.canEdit)
      this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    const errorKeys = Object.keys(
      this.control?.errors ?? []
    ) as (keyof typeof validationErrorMessages)[];

    return validationErrorMessages[errorKeys[0]] || 'Invalid field';
  }
}
