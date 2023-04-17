import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ProfileFormGroup } from '../profile-form-group';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { SelectOption } from 'src/app/models/configs';
import { ProfileTypeService } from 'src/app/services/profile-type.service';
import { FormTypes, PageStates } from 'src/app/utils';
import { ProfileService } from 'src/app/services/profile.service';
import { UtilsService } from 'src/app/helpers/utils.service';
import { us } from 'src/app/helpers';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-profile-form [form] [formType] [onCancel]',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() form!: ProfileFormGroup;
  @Input() formType!: FormTypes;

  // @Input() onSubmit?: (e: any) => any;
  // @Input() onCancel!: () => any;
  // @Input() onDelete?: () => any;

  @Output() onSubmit = new EventEmitter<ProfileFormGroup>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  get name(): AbstractControl {
    return this.form.get('name')!;
  }

  get timeTarget(): AbstractControl {
    return this.form.get('timeTarget')!;
  }

  get tasksTarget(): AbstractControl {
    return this.form.get('tasksTarget')!;
  }

  get priority(): AbstractControl {
    return this.form.get('priority')!;
  }

  get profileTypeId(): AbstractControl {
    return this.form.get('profileTypeId')!;
  }

  typeOptions: SelectOption[] = [];

  subscriptions: Subscription[] = [];

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.initSubs();
  }

  ngOnDestroy(): void {
    us.unsub(this.subscriptions);
  }

  initSubs(): void {
    // TODO better way to handle this?
    this.subscriptions.push(
      this.service.typesSet$.subscribe(() => {
        this.typeOptions = ProfileTypeService.toOptions(this.types);
      })
    );
  }

  showDelete(): boolean {
    return us.isEditForm(this.formType);
  }

  showSubmit(): boolean {
    return !us.isViewForm(this.formType);
  }
}
