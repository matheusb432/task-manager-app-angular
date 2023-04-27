import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { us } from 'src/app/helpers';
import { PaginationOptions } from 'src/app/helpers/pagination-options';
import { ApiService } from '../api';
import { AppService } from '../app.service';
import { ApiRequest } from 'src/app/models';
import { assertObjectsAreEqual } from './test-utils';

class MockItem {
  id?: number;
  name?: string;
}

describe('Service: Api', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, AppService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get', () => {
    it('should return an array of items', (done) => {
      const expectedItems = [{ id: 1 }, { id: 2 }];
      const apiRequest = { url: 'testUrl', itemType: MockItem };
      service.get<MockItem>(apiRequest).then((items) => {
        assertObjectsAreEqual(items, expectedItems);
        done();
      });
      const request = httpMock.expectOne('testUrl/odata');
      expect(request.request.method).toBe('GET');
      request.flush(expectedItems);
    });
  });

  describe('getPaginated', () => {
    it('should return a paginated result', (done) => {
      const expectedPaginatedResult = { total: 2, items: [{ id: 1 }, { id: 2 }] };
      const apiRequest = {
        url: us.buildPaginatedODataQuery('testUrl', PaginationOptions.first()),
        itemType: MockItem,
      };
      service.getPaginated<MockItem>(apiRequest).then((result) => {
        assertObjectsAreEqual(result, expectedPaginatedResult);
        done();
      });
      const request = httpMock.expectOne('testUrl/odata?$top=10&$skip=0&$count=true');
      expect(request.request.method).toBe('GET');
      request.flush(expectedPaginatedResult);
    });
  });

  describe('getById', () => {
    it('should return a single item', (done) => {
      const expectedItem = { id: 1 };
      const apiRequest = { url: 'testUrl', id: 1, itemType: MockItem };
      service.getById<MockItem>(apiRequest).then((item) => {
        assertObjectsAreEqual(item, expectedItem);
        done();
      });
      const request = httpMock.expectOne('testUrl/odata?$filter=(id eq 1)');
      expect(request.request.method).toBe('GET');
      request.flush([expectedItem]);
    });
  });

  describe('insert', () => {
    it('should return a successful response', (done) => {
      const mockData = { name: 'John' };
      const mockRequest = ApiRequest.post('api/users', mockData, MockItem);
      const mockResponse = { id: 1 };

      service.insert<MockItem>(mockRequest).then((response) => {
        assertObjectsAreEqual(response, mockResponse);
        done();
      });

      const mockHttpRequest = httpMock.expectOne('api/users');
      expect(mockHttpRequest.request.method).toEqual('POST');
      mockHttpRequest.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should return a successful response', (done) => {
      const id = 1;
      const mockData = { id, name: 'John' };
      const mockRequest = ApiRequest.put('api/users', id, mockData);

      service.update<MockItem>(mockRequest).then(() => {
        expect().nothing();
        done();
      });

      const mockHttpRequest = httpMock.expectOne('api/users/1');
      expect(mockHttpRequest.request.method).toEqual('PUT');
      mockHttpRequest.flush(null);
    });
  });

  describe('remove', () => {
    it('should return a successful response', (done) => {
      const id = 1;
      const mockRequest = ApiRequest.delete('api/users', id);

      service.remove(mockRequest).then(() => {
        expect().nothing();
        done();
      });

      const mockHttpRequest = httpMock.expectOne('api/users/1');
      expect(mockHttpRequest.request.method).toEqual('DELETE');
      mockHttpRequest.flush(null);
    });
  });
});
