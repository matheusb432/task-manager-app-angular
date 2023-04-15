import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileFormGroup } from 'src/app/components/profile';
import { profileForm } from 'src/app/helpers/validations';
import { ProfileService } from 'src/app/services/profile.service';

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
}
