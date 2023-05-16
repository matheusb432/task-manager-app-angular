import { inject } from '@angular/core/testing';
import { ProfileUtil } from '../profile.util';
import { ProfileTypes } from '../constants';
import { Profile, ProfileType } from 'src/app/models';

describe('Util: Profile', () => {
  const profiles: Profile[] = [
    { profileType: { type: ProfileTypes.Weekday }, priority: 1 },
    { profileType: { type: ProfileTypes.Weekday }, priority: 2 },
    { profileType: { type: ProfileTypes.Weekend }, priority: 2 },
    { profileType: { type: ProfileTypes.Weekend }, priority: 1 },
    { profileType: { type: ProfileTypes.Holiday }, priority: 3 },
    { profileType: { type: ProfileTypes.Holiday }, priority: 1 },
  ];

  it('should create', inject([ProfileUtil], (service: ProfileUtil) => {
    expect(service).toBeTruthy();
  }));

  describe('getActiveWeekdayProfile', () => {
    it('should return the weekday profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveWeekdayProfile(profiles);
      expect(profile?.priority).toBe(2);
    });

    it('should return null if no weekday profiles exist', () => {
      const profile = ProfileUtil.getActiveWeekdayProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getActiveWeekendProfile', () => {
    it('should return the weekend profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveWeekendProfile(profiles);
      expect(profile?.priority).toBe(2);
    });

    it('should return null if no weekend profiles exist', () => {
      const profile = ProfileUtil.getActiveWeekendProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getActiveHolidayProfile', () => {
    it('should return the holiday profile with the highest priority', () => {
      const profile = ProfileUtil.getActiveHolidayProfile(profiles);
      expect(profile?.priority).toBe(3);
    });

    it('should return null if no holiday profiles exist', () => {
      const profile = ProfileUtil.getActiveHolidayProfile([]);
      expect(profile).toBe(null);
    });
  });

  describe('getProfileDateRange', () => {
    it('should return the date range for a custom profile type', () => {
      const customProfileType: ProfileType = {
        type: 'custom',
        dateRangeStart: new Date('2023-05-01'),
        dateRangeEnd: new Date('2023-05-31'),
      };
      const dateRange = ProfileUtil.getProfileDateRange(customProfileType);
      expect(dateRange).toEqual({
        start: customProfileType.dateRangeStart as Date,
        end: customProfileType.dateRangeEnd as Date,
      });
    });

    it('should return null for a profile type that is not custom', () => {
      const profileType: ProfileType = {
        type: ProfileTypes.Weekday,
        dateRangeEnd: new Date(),
        dateRangeStart: new Date(),
      };
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
      profileType.type = ProfileTypes.Weekend;
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
      profileType.type = ProfileTypes.Holiday;
      expect(ProfileUtil.getProfileDateRange(profileType)).toBeNull();
    });
  });

  describe('isWeekdayProfile', () => {
    it('should return true if type is Weekday', () => {
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Weekday)).toBeTrue();
    });

    it('should return false if type is not Weekday', () => {
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Weekend)).toBeFalse();
      expect(ProfileUtil.isWeekdayProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });

  describe('isWeekendProfile', () => {
    it('should return true if type is Weekend', () => {
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Weekend)).toBeTrue();
    });

    it('should return false if type is not Weekend', () => {
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isWeekendProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });

  describe('isHolidayProfile', () => {
    it('should return true if type is Holiday', () => {
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Holiday)).toBeTrue();
    });

    it('should return false if type is not Holiday', () => {
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isHolidayProfile(ProfileTypes.Weekend)).toBeFalse();
    });
  });

  describe('isCustomProfile', () => {
    it('should return true if type is Custom', () => {
      expect(ProfileUtil.isCustomProfile('custom')).toBeTrue();
    });

    it('should return false if type is not Custom', () => {
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Weekday)).toBeFalse();
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Weekend)).toBeFalse();
      expect(ProfileUtil.isCustomProfile(ProfileTypes.Holiday)).toBeFalse();
    });
  });
});
