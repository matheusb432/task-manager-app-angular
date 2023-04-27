import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '../local-storage.service';
import { STORE_SERVICE } from '../base';

// TODO Implement
describe('Service: LocalStorage', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: 'LOCALSTORAGE', useValue: window.localStorage },
        { provide: 'SESSIONSTORAGE', useValue: window.sessionStorage },
      ],
    });
    service = TestBed.inject(STORE_SERVICE);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
