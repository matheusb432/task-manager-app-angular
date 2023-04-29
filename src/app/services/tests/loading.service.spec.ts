import { TestBed } from '@angular/core/testing';
import { Loading } from 'src/app/models/configs';
import { AppService } from '../app.service';
import { LoadingService } from '../loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let appService: jasmine.SpyObj<AppService>;
  const mockElId = 'elId';

  beforeEach(() => {
    appService = jasmine.createSpyObj('AppService', ['getManyByUrl']);
    TestBed.configureTestingModule({
      providers: [LoadingService, { provide: AppService, useValue: appService }],
    });
    service = TestBed.inject(LoadingService);
  });

  describe('addLoading', () => {
    it('should add loading with id', () => {
      const id = 'testId';
      const loading = LoadingService.createFromId(mockElId);

      service.addLoading(id, loading);

      expect(service.loadings).toEqual([{ id, ...loading }]);
    });
  });

  describe('addLoadings', () => {
    it('should add loadings with ids', () => {
      const id = 'testId';
      const loadings = LoadingService.createManyFromIds([mockElId + 1, mockElId + 2]);

      service.addLoadings(id, loadings);

      expect(service.loadings).toEqual([
        { id, ...loadings[0] },
        { id, ...loadings[1] },
      ]);
    });
  });

  describe('shouldBeLoading', () => {
    it('should return true if should be loading', () => {
      const targetElId = 'target';
      service['loadings'] = [{ id: 'id', targetElId, size: 100 }];

      const result = service.shouldBeLoading(targetElId);
      expect(result).toBeTrue();
    });

    it('should return false if should not be loading', () => {
      const targetElId = 'target';
      service['loadings'] = [{ id: 'id', targetElId, size: 100 }];

      const result = service.shouldBeLoading('other');

      expect(result).toBeFalse();
    });
  });

  describe('getLoadingByElId', () => {
    it('should get loading by element id', () => {
      const loading: Loading = { id: 'testId', targetElId: 'target', size: 50 };
      service['loadings'] = [loading];

      const result = service.getLoadingByElId('target');

      expect(result).toEqual(loading);
    });

    it('should not get loading if element id is undefined', () => {
      const loading: Loading = { id: 'testId', targetElId: 'target', size: 100 };
      service['loadings'] = [loading];

      const result = service.getLoadingByElId(undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('removeLoadingByElId', () => {
    it('should remove loading by id', () => {
      const loading: Loading = { id: 'testId', targetElId: 'target', size: 100 };

      service['loadings'] = [loading];
      service.removeLoadingById('testId');

      expect(service.loadings).toEqual([]);
    });
  });
});
