import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { us } from 'src/app/helpers';
import { PaginationOptions } from '../../helpers/pagination-options';
import { User, PaginatedResult } from 'src/app/models';
import { UserApiService } from '../api';
import { assertAreEqual } from './test-utils';

describe('Service: UserApi', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApiService],
    });
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getById', () => {
    it('should return a User', () => {
      const id = 1;
      const mockUser: User = { id: 1, name: 'John Doe' };

      service.getById(id).then();
      const req = httpMock.expectOne(us.buildODataQuery(service['url'], { filter: { id } }));
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('getPaginated', () => {
    it('should return a PaginatedResult of Users', () => {
      const mockPaginationOptions: PaginationOptions = { page: 1, itemsPerPage: 10 };
      const mockPaginatedResult: PaginatedResult<User> = {
        total: 1,
        items: [{ id: 1, name: 'John Doe' }],
      };

      service.getPaginated(mockPaginationOptions).then((result) => {
        assertAreEqual(result, mockPaginatedResult);
      });

      const req = httpMock.expectOne(
        `${us.buildPaginatedODataQuery(service['url'], mockPaginationOptions)}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResult);
    });
  });
});
