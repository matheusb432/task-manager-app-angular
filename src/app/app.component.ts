import { Component } from '@angular/core';
import { AuthService } from './services';
import { LoginRequest } from './models/dtos/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    // TODO remove
    this.authService.login(LoginRequest.withEmail('emaisl@testtt.com', 'abc123')).then((result) => {
      console.log(result);
    });
  }
}
