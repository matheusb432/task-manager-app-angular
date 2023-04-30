import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageModule } from 'src/app/shared';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginFormComponent } from 'src/app/components/authentication/login-form/login-form.component';
import { SignupFormComponent } from 'src/app/components/authentication/signup-form/signup-form.component';
import { CrudPageModule } from 'src/app/shared/crud-page.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent, LoginFormComponent, SignupFormComponent],
  imports: [CommonModule, AuthenticationRoutingModule, PageModule, CrudPageModule],
  exports: [LoginFormComponent, SignupFormComponent],
})
export class AuthenticationModule {}
