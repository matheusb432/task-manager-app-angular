import { AddMap } from 'mapper-ts/lib-esm';
import { GoalStep } from './goal-step';
import { GoalTaskItem } from './goal-task-item';

export class Goal {
  id?: number;
  title?: string;
  image?: string;
  @AddMap(GoalStep)
  goalSteps?: GoalStep[];
  @AddMap(GoalTaskItem)
  goalTaskItems?: GoalTaskItem[];
}
