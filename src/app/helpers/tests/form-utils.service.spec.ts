import { TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormUtilsService } from '../form-utils.service';

fdescribe('FormUtilsService', () => {
  let service: FormUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit save event when form is valid', () => {
    const form = new FormGroup({
      name: new FormControl('valid name', Validators.required),
      email: new FormControl('valid@email.com', Validators.email),
    });

    const saveEmitter = new EventEmitter<FormGroup>();
    spyOn(saveEmitter, 'emit');

    FormUtilsService.onSubmit(form, saveEmitter);

    expect(saveEmitter.emit).toHaveBeenCalledWith(form);
  });

  it('should mark all form controls as touched when form is invalid', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
    });

    form.controls.name.markAsTouched = jasmine.createSpy('markAsTouched');

    const saveEmitter = new EventEmitter<FormGroup>();
    spyOn(saveEmitter, 'emit');

    FormUtilsService.onSubmit(form, saveEmitter);

    expect(form.controls.name.markAsTouched).toHaveBeenCalled();
    expect(saveEmitter.emit).not.toHaveBeenCalled();
  });
});
