import { Injectable, inject } from '@angular/core';
import { UserApiService } from '../../user/services/user-api.service';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { paths } from 'src/app/util';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userApiService = inject(UserApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  goToIndex() {
    return this.router.navigateByUrl(paths.home);
  }
}
