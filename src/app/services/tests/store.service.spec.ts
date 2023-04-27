import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../local-storage.service';
import { Inject } from '@angular/core';
import { STORE_SERVICE } from '../base';
import { StoreKeys } from 'src/app/utils';

// TODO remove fdescribe
fdescribe('Service: Store', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: STORE_SERVICE, useClass: LocalStorageService }],
    });
    service = TestBed.inject(STORE_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return the store object', () => {
      const mockResponse = {
        id: 1,
        name: 'name',
        address: 'address',
        city: 'city',
        state: 'state',
        zip: 'zip',
        phone: 'phone',
        email: 'email',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(service.get).toEqual(mockResponse);
    });
  });

  describe('store', () => {
    it('should return the store object', () => {
      const mockKey = 'mockKey' as StoreKeys;
      const mockResponse = {
        id: 1,
        name: 'name',
        address: 'address',
        city: 'city',
        state: 'state',
        zip: 'zip',
        phone: 'phone',
        email: 'email',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.store({ key: mockKey, value: mockResponse})
      expect(service.store).toEqual(mockResponse);
    });
  });
});
