import { IgnoreMap } from 'mapper-ts/lib-esm';

@IgnoreMap('id')
export class PresetTaskItemPostDto {
  title?: string;
  time?: number;
  importance?: number;
  comment?: string;
}
