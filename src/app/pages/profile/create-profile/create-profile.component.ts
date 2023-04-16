import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileFormGroup } from 'src/app/components/profile';
import { profileForm } from 'src/app/helpers/validations';
import { ProfileService } from 'src/app/services/profile.service';
import { Pages } from 'src/app/utils';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  // TODO implement form
  profileForm!: ProfileFormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: ProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.profileForm);
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group(profileForm) as unknown as ProfileFormGroup;
  }

  submitForm(): () => Promise<void> {

    return () => console.log(this.profileForm.value) as any;
    // TODO uncomment & remove above
    // return () => this.create();
  }

  async create(): Promise<void> {
    const item = this.profileForm.value;

    const { id } = await this.service.insert(item);

    console.warn(`Created profile id => ${id}`);
    // TODO implement toast & details page
    // this.toastService.success();
    // this.service.goToDetails(id, DetailsTypes.View);
  }

  cancel(): () => void {
    return () => this.goToList();
    // TODO clean
    // return () => {
    //   this.router.navigateByUrl(`/${Pages.Profiles}`);
    // };
  }

  goToList = () => this.router.navigateByUrl(`/${Pages.Profiles}`);
}
