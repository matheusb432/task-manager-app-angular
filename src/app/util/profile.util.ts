import { Injectable } from '@angular/core';
import { ProfileTypes } from './constants';
import {
  ActiveProfileIds,
  ProfileIdsStore,
  Profile,
  ProfileDateRange,
  ProfileDateValues,
  ProfileType,
} from '../models';
import { DateRangeValue } from '../components/custom/inputs';
import { ArrayUtil } from './array.util';
import { StringUtil } from './string.util';
import { DateUtil } from './date.util';

@Injectable({
  providedIn: 'root',
})
export class ProfileUtil {
  /**
   * @description
   * Legendary method that normalizes profile ids to a data table of date profile ids.
   *
   * Priority order:
   * 1. Custom date ranges
   * 2. Holidays
   * 3. Weekends
   * 4. Weekdays
   *
   */
  // TODO tests then refactor
  static buildProfileIdsStore(
    activeIds: ActiveProfileIds,
    range: { start: Date; end: Date },
    holidays: Date[] = []
  ): ProfileIdsStore {
    const dict: ProfileIdsStore = {
      byDate: {},
      dates: [],
    };
    const { start: from, end: to } = range;
    const { weekday, weekend, holiday, customDateRanges } = activeIds;
    const size = DateUtil.daysDiff(from, to) + 1;

    const customDateRangesInRange = ArrayUtil.orderItems(
      customDateRanges.filter((range) => {
        const { start, end } = range;
        return DateUtil.areDatesInDateRangeInclusive([start, end], from, to);
      }),
      'priority',
      'desc'
    );

    const hasCustom = !!customDateRangesInRange.length;
    // TODO method to get custom date ranges for date range

    for (let daysToAdd = 0; daysToAdd < size; daysToAdd++) {
      const date = DateUtil.addDays(from, daysToAdd);
      const { formattedDate, isWeekend, isHoliday } = this.getDateValuesForProfile(date, holidays);
      let dateProfileId: number | null = null;

      // TODO to method that resolves value
      if (hasCustom) {
        const customDateRange = customDateRangesInRange.find((range) => {
          const { start, end } = range;
          return DateUtil.isInDateRangeInclusive(date, start, end);
        });

        if (customDateRange != null) {
          dateProfileId = customDateRange.profileId;
          dict.byDate[formattedDate] = dateProfileId;
          dict.dates.push(formattedDate);
          continue;
        }
      }
      if (isHoliday && holiday != null) {
        dateProfileId = holiday;
        dict.byDate[formattedDate] = dateProfileId;
        dict.dates.push(formattedDate);
        continue;
      }
      if (isWeekend && weekend != null) {
        dateProfileId = weekend;
        dict.byDate[formattedDate] = dateProfileId;
        dict.dates.push(formattedDate);
        continue;
      }
      if (weekday != null) {
        dateProfileId = weekday;
        // TODO dict type to generic type
        dict.byDate[formattedDate] = dateProfileId;
        dict.dates.push(formattedDate);
        continue;
      }
    }

    return dict;
  }

  static getOrderedCustomDateRangesInRange(
    customDateRanges: ProfileDateRange[],
    from: Date,
    to: Date
  ): ProfileDateRange[] {
    if (!customDateRanges.length) return [];

    return ArrayUtil.orderItems(
      customDateRanges.filter((range) => {
        return DateUtil.isRangeInRangeInclusive(range, { start: from, end: to });
      }),
      'priority',
      'desc'
    );
  }

  static getActiveWeekdayProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Weekday);
  }

  static getActiveWeekendProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Weekend);
  }

  static getActiveHolidayProfile(profiles: Profile[]): Profile | null {
    return this.getActiveProfileByType(profiles, ProfileTypes.Holiday);
  }

  static getCustomProfileDateRanges(profiles: Profile[]): ProfileDateRange[] {
    return profiles
      .filter((p): p is Required<Profile> => p?.id != null && p.profileType != null)
      .filter(({ profileType: { type } }) => this.isCustomProfile(type))
      .map((p): ProfileDateRange | null => {
        const {
          id,
          priority,
          profileType: { dateRangeStart, dateRangeEnd },
        } = p;
        if (!dateRangeStart || !dateRangeEnd) return null;

        return { profileId: id, start: dateRangeStart, end: dateRangeEnd, priority: priority ?? 0 };
      })
      .filter((p): p is ProfileDateRange => p != null);
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

  static getDateValuesForProfile(date: Date, holidays: Date[] = []): ProfileDateValues {
    const dayIndex = date.getDay();

    const formattedDate = DateUtil.formatDateToUniversalFormat(date);
    const isWeekend = DateUtil.isWeekend(dayIndex);
    const isHoliday = DateUtil.isDateInDates(date, holidays);

    return {
      formattedDate,
      isWeekend,
      isHoliday,
    };
  }
}
