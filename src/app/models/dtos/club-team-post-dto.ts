import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class ClubTeamPostDto {
  name?: string;
  description?: string;
  clubBadge?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
