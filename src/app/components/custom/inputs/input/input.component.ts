import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormLayoutComponent } from 'src/app/components/layout/form-layout/form-layout.component';
import { IconConfig, WithDestroyed } from 'src/app/models';
import { LoadingService } from 'src/app/services/loading.service';
import { FormUtil } from 'src/app/util';
import { validationErrorMessages } from '../validation-errors';

@Component({
  selector: 'app-input [fcName] [labelText]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends WithDestroyed implements OnInit, OnDestroy, OnChanges {
  @Input() fcName!: string;
  @Input() labelText!: string;
  @Input() labelIcon?: IconConfig<never>;
  @Input() type = 'text';
  @Input() helpers?: string[];
  @Input() errText?: string;
  @Input() placeholder = '';
  @Input() elId = '';
  @Input() canEdit = true;
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Input() isInvalid = () => !!this.control && this.control.invalid && this.control.touched;

  @Output() keydownPressed = new EventEmitter<KeyboardEvent>();

  isLoading = false;

  get formId() {
    return this.formWrapper.id || '';
  }

  get fg() {
    return this.formWrapper.formGroup ?? null;
  }

  get invalid(): boolean {
    return this.isInvalid();
  }

  get disabled(): boolean {
    return !!this.control?.disabled;
  }

  get control() {
    return this.fg.controls[this.fcName];
  }

  get id(): string {
    return this.elId || FormUtil.buildId(this.fcName, this.formId);
  }

  get canEditSelf(): boolean {
    return this.canEdit && this.formWrapper?.canEdit;
  }

  constructor(
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    public formWrapper: FormLayoutComponent
  ) {
    super();
  }

  ngOnInit(): void {
    FormUtil.updateStatusOnFormChange(this.fg, this.destroyed$, () => this.changeControlEnabled());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elId'] && !!this.elId) {
      this.initLoadingSubscription();
    }

    if (changes['fcName'] || changes['canEdit']) {
      this.changeControlEnabled();
    }
  }

  initLoadingSubscription(): void {
    this.loadingService
      .isLoadingById$(this.elId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;

        this.changeControlEnabled();
        this.cdRef.detectChanges();
      });
  }

  changeControlEnabled(): void {
    if (!this.isLoading && this.canEditSelf) this.control?.enable();
    else this.control?.disable();
  }

  getErrText(): string {
    const errorKeys = Object.keys(
      this.control?.errors ?? []
    ) as (keyof typeof validationErrorMessages)[];

    return validationErrorMessages[errorKeys[0]] || 'Invalid field';
  }
}
