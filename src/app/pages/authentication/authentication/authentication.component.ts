import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Pages, paths } from 'src/app/utils';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  switchPageLabel = 'Already have an account? Login';

  get isLoginPage(): boolean {
    return this.router.url === paths.login;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.setSwitchPageLabel()
    this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        tap(() => this.setSwitchPageLabel())
      )
      .subscribe();
  }

  switchPage(): void {
    this.router.navigate([this.isLoginPage ? Pages.Signup : Pages.Login]);
  }

  setSwitchPageLabel(): void {
      this.switchPageLabel = this.isLoginPage
        ? "Don't have an account? Sign up"
        : 'Already have an account? Login';
  }
}
