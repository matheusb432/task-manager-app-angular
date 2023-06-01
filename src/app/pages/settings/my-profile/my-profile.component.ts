import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PageLayoutComponent } from 'src/app/shared/components/layouts/page-layout/page-layout.component';
import { FormTypes } from 'src/app/util';
import { getUserForm, UserFormGroup } from '../../user/components/user-form/user-form-group';
import { MyProfileFormComponent } from '../components/my-profile-form/my-profile-form.component';
import { SettingsService } from '../services/settings.service';
import {
  getMyProfileForm,
  MyProfileFormGroup,
} from '../components/my-profile-form/my-profile-form-group';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, MyProfileFormComponent],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnInit {
  private service = inject(SettingsService);
  private cdRef = inject(ChangeDetectorRef);

  form!: MyProfileFormGroup;

  FormTypes = FormTypes;

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.runInitMethods();
  }

  runInitMethods(): void {
    this.initForm();

    // this.loadData();
  }

  // TODO implement
  // async loadData(): Promise<void> {
  //   const loadedItem = await this.service.loadEditData(this.pageData?.id);

  //   if (loadedItem == null) {
  //     this.service.goToList();
  //     return;
  //   }

  //   if (this.form == null) {
  //     this.form = UserFormGroup.from(getUserCreateForm());
  //   }
  //   this.form.patchValue(this.service.convertToFormValue(loadedItem));
  //   this.form.markAllAsTouched();
  //   this.cdRef.detectChanges();
  // }

  initForm(): void {
    if (this.form == null) {
      this.form = MyProfileFormGroup.from(getMyProfileForm());
    } else {
      this.form.patchValue({});
    }
  }

  submitForm(): Promise<void> {
    // TODO add submit logic
    return {} as any;
    // return this.editItem();
  }

  // async editItem(): Promise<void> {
  //   const value = MyProfileFormGroup.toJson(this.form);

  //   await this.service.update(this.pageData?.id, {
  //     ...value,
  //     userRoles: value.roleIds?.map((x) => ({
  //       roleId: x,
  //     })),
  //   });
  // }

  onCancel(): Promise<boolean> {
    return this.service.goToIndex();
  }
}
