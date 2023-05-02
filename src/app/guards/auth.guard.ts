import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService, ToastService } from '../services';
import { paths } from '../utils';

export const canActivateAuth = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const ts = inject(ToastService);
  if (service.isLoggedIn) return true;

  ts.warning('You need to login first!');

  return router.parseUrl(paths.login);
};

export const canActivateAuthPage = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const ts = inject(ToastService);

  console.log(service.isLoggedIn);
  if (!service.isLoggedIn) return true;

  ts.warning('You are already logged in! Logout if you want to enter with another account.');

  return router.parseUrl(paths.home);
};
