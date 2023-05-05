import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Pages } from 'src/app/util';

const routes: Routes =

    [
      {
        path: Pages.Login,
        component: LoginComponent,
      },
      {
        path: Pages.Signup,
        component: SignupComponent,
      },
    ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
