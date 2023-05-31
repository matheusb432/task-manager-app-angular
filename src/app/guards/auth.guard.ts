import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService, ToastService } from '../services';
import { paths } from '../util';

export const canActivateAuth = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const ts = inject(ToastService);
  if (service.isLoggedIn) return true;

  ts.info('Login to access other pages');

  return router.parseUrl(paths.login);
};

export const canActivateAuthAdmin = (service = inject(AuthService)): boolean => {
  const ts = inject(ToastService);
  if (service.isAdmin) return true;

  ts.warning('You do not have permission to access this page');

  return false;
};

export const canActivateAuthPage = (service = inject(AuthService)): true | UrlTree => {
  const router = inject(Router);
  const ts = inject(ToastService);

  if (!service.isLoggedIn) return true;

  ts.info('You are already logged in! Logout if you want to enter with another account.');

  return router.parseUrl(paths.home);
};
