import { IgnoreMap } from "mapper-ts/lib-esm";

@IgnoreMap('id')
export class TaskItemNotePostDto {
  comment?: string;
  taskItemId?: number;
}
