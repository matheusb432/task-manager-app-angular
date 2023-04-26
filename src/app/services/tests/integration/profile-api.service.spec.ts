// TODO implement integration test
/*
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PaginationOptions } from 'src/app/helpers/pagination-options';
import { Profile } from 'src/app/models/entities';
import { PaginatedResult } from 'src/app/models/types';
import { ProfileApiService } from '../../api';


fdescribe('Integration: Profile Api', () => {
  let service: ProfileApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileApiService],
    });

    service = TestBed.inject(ProfileApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getPaginated', () => {
    it('should return a paginated result of T when the request is valid', () => {
      const options = PaginationOptions.first(10);
      const expectedData = {
        total: 2,
        items: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
      } as PaginatedResult<Profile>;

      service.getPaginated(options).then((result) => {
        expect(result).toEqual(expectedData);
      });
    });
  });

  describe('getById', () => {
    it('should return a T when the request is valid', async () => {
      const id = 1;
      const expectedData = { id: 1, name: 'John' } as Profile;

      service.getById(id).then((result) => {
        expect(result).toEqual(expectedData);
      });
    });
  });
});
*/
