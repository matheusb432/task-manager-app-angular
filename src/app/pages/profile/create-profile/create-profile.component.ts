import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileFormGroup } from 'src/app/components/profile';
import { profileForm } from 'src/app/helpers/validations';
import { ToastService } from 'src/app/services';
import { ProfileService } from 'src/app/services/profile.service';
import { FormTypes, Pages } from 'src/app/utils';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  profileForm!: ProfileFormGroup;

  formTypes = FormTypes;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: ProfileService,
    private ts: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group(profileForm) as unknown as ProfileFormGroup;
  }

  submitForm(): Promise<void> {
    console.log('ultra test1');
    return this.create();
  }

  // TODO implement create
  async create(): Promise<void> {
    const item = this.profileForm.value;

    this.ts.success({ message: 'Profile created successfully', duration: 0 });

    // const { id } = await this.service.insert(item);

    // console.warn(`Created profile id => ${id}`);
    // TODO implement toast & details page
    // this.toastService.success();
    // this.service.goToDetails(id, DetailsTypes.View);
  }

  cancel(): void {
    return this.goToList();
  }

  goToList = () => {
    this.router.navigateByUrl(`/${Pages.Profiles}`);}
}
