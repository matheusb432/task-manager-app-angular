import { Injectable } from '@angular/core';
import { ProfileTypes } from './constants';
import { Profile, ProfileType } from '../models';
import { DateRangeValue } from '../components/custom/inputs';
import { ArrayUtil } from './array.util';
import { StringUtil } from './string.util';

@Injectable({
  providedIn: 'root',
})
export class ProfileUtil {
  static getActiveWeekdayProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Weekday);
  }

  static getActiveWeekendProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Weekend);
  }

  static getActiveHolidayProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Holiday);
  }

  private static getActiveProfileByType(
    profiles: Profile[],
    typeFilter: ProfileTypes
  ): Profile | null {
    const compareFns = {
      [ProfileTypes.Weekday]: this.isWeekdayProfile,
      [ProfileTypes.Weekend]: this.isWeekendProfile,
      [ProfileTypes.Holiday]: this.isHolidayProfile,
    };
    const compareFn = compareFns[typeFilter];

    if (!compareFn) return null;

    const typeProfiles = profiles.filter((p) => {
      const type = p.profileType?.type;

      if (!type) return false;

      return compareFn(type as ProfileTypes);
    });

    if (!typeProfiles.length) return null;

    const priorityProfile = ArrayUtil.orderItems(typeProfiles, 'priority', 'desc')[0];

    return priorityProfile;
  }

  static getProfileDateRange(type: ProfileType): DateRangeValue | null {
    if (!type.type || !this.isCustomProfile(type.type)) return null;

    const { dateRangeStart, dateRangeEnd } = type;

    if (!dateRangeStart || !dateRangeEnd) return null;

    return {
      start: dateRangeStart,
      end: dateRangeEnd,
    };
  }

  static isWeekdayProfile(type: ProfileTypes): boolean {
    return type === ProfileTypes.Weekday;
  }

  static isWeekendProfile(type: ProfileTypes): boolean {
    return type === ProfileTypes.Weekend;
  }

  static isHolidayProfile(type: ProfileTypes): boolean {
    return type === ProfileTypes.Holiday;
  }

  static isCustomProfile(type: string | undefined): boolean {
    if (!type) return false;

    return StringUtil.stringsEqual(type, 'custom');
  }
}
