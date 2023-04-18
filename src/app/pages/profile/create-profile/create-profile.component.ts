import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileFormGroup } from 'src/app/components/profile';
import { profileForm } from 'src/app/helpers/validations';
import { Profile } from 'src/app/models/entities';
import { ProfileType } from 'src/app/models/entities/profile-type';
import { PageService, ToastService } from 'src/app/services';
import { ProfileService } from 'src/app/services/profile.service';
import { DetailsTypes, FormTypes, Pages } from 'src/app/utils';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements OnInit {
  form!: ProfileFormGroup;

  formTypes = FormTypes;

  get types(): ProfileType[] {
    return this.service.types;
  }

  constructor(
    private router: Router,
    private pageService: PageService,
    private service: ProfileService,
    private ts: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.loadData();
  }

  initForm(): void {
    this.form = this.pageService.buildForm(profileForm);
  }

  async loadData(): Promise<void> {
    await this.service.loadCreateData();
  }

  submitForm(): Promise<void> {
    return this.create();
  }

  async create(): Promise<void> {
    const item = this.form.value as Profile;

    const { id } = await this.service.insert(item);

    this.ts.success('Profile created successfully');
    this.service.goToDetails(id, DetailsTypes.View);
  }

  cancel(): void {
    return this.goToList();
  }

  goToList = () => {
    this.router.navigateByUrl(`/${Pages.Profiles}`);
  };
}
