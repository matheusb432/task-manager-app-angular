import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthToken } from 'src/app/models/types';
import { assertAreEqual } from './test-utils';
import { STORE_SERVICE } from '../interfaces';
import { LocalStorageService } from '../local-storage.service';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('Service: Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let url: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: STORE_SERVICE, useClass: LocalStorageService }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    url = service['url'];
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should return the access token object', (done) => {
      const mockResponse: AuthToken = {
        access_token: 'token',
        expires_in: 5000,
        userEmail: 'email@email.com',
      };

      service.login('email', 'password').then((response) => {
        assertAreEqual(response, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should store the access tokens in local storage', (done) => {
      const mockResponse: AuthToken = {
        access_token: 'access-token',
        expires_in: 5000,
        userEmail: 'email',
      };
      const expectedAccessToken = JSON.stringify(mockResponse);

      service.login('email', 'password').then(() => {
        const accessToken = localStorage.getItem('access_token');

        expect(accessToken).toBe(expectedAccessToken);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should return an error if the login fails', (done) => {
      const mockResponse = { message: 'error' };

      service.login('email', 'password').catch((error: HttpErrorResponse) => {
        assertAreEqual(error.status, 401);
        assertAreEqual(error.statusText, 'Unauthorized');
        assertAreEqual(error.error, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('signup', () => {
    it('should return the access token object', (done) => {
      const mockResponse: AuthToken = {
        access_token: 'token',
        expires_in: 5000,
        userEmail: 'email@email.com',
      };

      service.signup('email', 'password').then((response) => {
        assertAreEqual(response, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should store the access tokens in local storage', (done) => {
      const mockResponse: AuthToken = {
        access_token: 'access-token',
        expires_in: 5000,
        userEmail: 'email',
      };
      const expectedAccessToken = JSON.stringify(mockResponse);

      service.signup('email', 'password').then(() => {
        const accessToken = localStorage.getItem('access_token');

        expect(accessToken).toBe(expectedAccessToken);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should return an error if the signup fails', (done) => {
      const mockResponse = { message: 'error' };

      service.signup('email', 'password').catch((error: HttpErrorResponse) => {
        assertAreEqual(error.status, 401);
        assertAreEqual(error.statusText, 'Unauthorized');
        assertAreEqual(error.error, mockResponse);
        done();
      });

      const request = httpMock.expectOne(`${url}/signup`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove the access tokens from local storage', (done) => {
      localStorage.setItem('access_token', 'token');
      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      done();
    });
  });
});
