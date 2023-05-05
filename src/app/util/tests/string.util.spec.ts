import { TestBed, inject } from '@angular/core/testing';
import { StringUtil } from '../string.util';

describe('Util: String', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringUtil],
    });
  });

  it('should create', inject([StringUtil], (service: StringUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('capitalize', () => {
    it('should return an empty string when given a falsy value', () => {
      expect(StringUtil.capitalize(undefined)).toEqual('');
      expect(StringUtil.capitalize('')).toEqual('');
    });

    it('should capitalize the first letter of a word', () => {
      expect(StringUtil.capitalize('hello')).toEqual('Hello');
    });
  });

  describe('timeToNumber', () => {
    it('should return 0 when given an invalid time', () => {
      expect(StringUtil.timeToNumber('')).toEqual(0);
      expect(StringUtil.timeToNumber('invalid')).toEqual(0);
      expect(StringUtil.timeToNumber('1:2:3')).toEqual(0);
    });

    it('should convert a valid time string to a number', () => {
      expect(StringUtil.timeToNumber('12:34')).toEqual(1234);
    });
  });

  describe('numberToTime', () => {
    it('should return an empty string when given an invalid number', () => {
      expect(StringUtil.numberToTime(-1)).toEqual('');
      expect(StringUtil.numberToTime(12345)).toEqual('');
    });

    it('should convert a valid number to a time string', () => {
      expect(StringUtil.numberToTime(1234)).toEqual('12:34');
      expect(StringUtil.numberToTime(559)).toEqual('05:59');
      expect(StringUtil.numberToTime(56)).toEqual('00:56');
      expect(StringUtil.numberToTime(7)).toEqual('00:07');
      expect(StringUtil.numberToTime(0)).toEqual('00:00');
    });
  });


  describe('isEmail', () => {
    it('should return true when email is valid', () => {
      expect(StringUtil.isEmail('email@example.com')).toBe(true);
    });

    it('should return false when email is invalid', () => {
      expect(StringUtil.isEmail('email')).toBe(false);
    });
  });

  describe('notEmpty', () => {
    it('should return false when passed an empty array', () => {
      const result = StringUtil.notEmpty([]);
      expect(result).toBeFalse();
    });

    it('should return false when passed an empty string', () => {
      const result = StringUtil.notEmpty('');
      expect(result).toBeFalse();
    });

    it('should return false when passed undefined', () => {
      const result = StringUtil.notEmpty(undefined as unknown as unknown[]);
      expect(result).toBeFalse();
    });

    it('should return true when passed an array with items', () => {
      const result = StringUtil.notEmpty([1, 2, 3]);
      expect(result).toBeTrue();
    });

    it('should return true when passed a string with characters', () => {
      const result = StringUtil.notEmpty('word');
      expect(result).toBeTrue();
    });
  });

  describe('unsafeRandomHex', () => {
    it('should return a random hex string of the provided length', () => {
      const expectedLength = 10;
      const result = StringUtil.unsafeRandomHex(expectedLength);

      expect(result).toBeTruthy();
      expect(result.length).toBe(expectedLength);
    });
  })
});
