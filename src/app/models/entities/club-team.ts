import { Entity } from './../types/entity';

export class ClubTeam implements Entity {
  id?: number;
  name?: string;
  description?: string;
  badge?: string;
  primary?: string;
  secondary?: string;
  active?: boolean;

  static empty = (): ClubTeam => {
    return {
      id: 0,
      name: '',
      description: '',
      badge: '',
      primary: '',
      secondary: '',
      active: true,
    };
  };

  static tableKeys = (): (keyof ClubTeam)[] =>
    ['id', 'name', 'description', 'badge', 'primary', 'secondary'] as (keyof ClubTeam)[];

  static tableHeaders = () => ['#', 'name', 'description', 'badge', 'primary', 'secondary'];
}