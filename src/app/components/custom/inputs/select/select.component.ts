import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SelectOption, WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { FormUtil, PubSubUtil, StringUtil } from 'src/app/util';
import { validationErrorMessages } from '../validation-errors';

@Component({
  selector: 'app-select [fcName] [fg] [labelText] [options]',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends WithDestroyed implements OnDestroy, OnChanges {
  @Input() fcName!: string;
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

  get control(): AbstractControl | null {
    return this.fg.controls[this.fcName];
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fcName, this.formId);
  }

  constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['formId'] && !!this.formId) || (changes['elId'] && !!this.elId)) {
      this.initLoadingSubscription();
    }

    if (changes['control'] || changes['canEdit'] || changes['options']) {
      this.changeControlEnabled();
    }
  }

  initLoadingSubscription(): void {
    PubSubUtil.untilDestroyed(
      this.loadingService.isLoadingByIds$([this.elId, this.formId]),
      this.destroyed$
    ).subscribe((isLoading) => {
      this.isLoading = isLoading;

      this.changeControlEnabled();
      this.cdRef.detectChanges();
    });
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
