import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CrudPageModule } from 'src/app/shared/crud-page.module';
import { AuthPageLayoutComponent } from 'src/app/components/layout/auth-page-layout/auth-page-layout.component';
import { LoginFormComponent, SignupFormComponent } from 'src/app/components/authentication';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    CrudPageModule,
    LoginComponent,
    SignupComponent,
    LoginFormComponent,
    SignupFormComponent,
    AuthPageLayoutComponent,
  ],
  exports: [LoginFormComponent, SignupFormComponent],
})
export class AuthenticationModule {}
