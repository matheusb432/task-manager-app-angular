import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthToken } from 'src/app/models/types';
import { assertObjectsAreEqual } from './test-utils';

// TODO remove fdescribe
describe('Service: Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let url: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
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
        refresh_token: 'token',
        expires_in: 5000,
        userEmail: 'email@email.com',
      };

      service.login('email', 'password').then((response) => {
        assertObjectsAreEqual(response, mockResponse as any);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should store the access tokens in local storage', (done) => {
      const expectedAccessToken = 'access-token';
      const expectedRefreshToken = 'refresh-token';
      const mockResponse: AuthToken = {
        access_token: expectedAccessToken,
        refresh_token: expectedRefreshToken,
        expires_in: 5000,
        userEmail: 'email',
      };

      service.login('email', 'password').then(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        expect(accessToken).toBe(expectedAccessToken);
        expect(refreshToken).toBe(expectedRefreshToken);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse);
    });

    it('should return an error if the login fails', (done) => {
      const mockResponse = { message: 'error' };

      service.login('email', 'password').catch((error) => {
        assertObjectsAreEqual(error, mockResponse as any);
        done();
      });

      const request = httpMock.expectOne(`${url}/login`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove the access tokens from local storage', (done) => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'token');

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      done();
    });

    it('should return an error if the logout fails', (done) => {
      const mockResponse = { message: 'error' };

      service.logout().catch((error) => {
        assertObjectsAreEqual(error, mockResponse as any);
        done();
      });

      const request = httpMock.expectOne(`${url}/logout`);
      expect(request.request.method).toBe('POST');
      request.flush(mockResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
