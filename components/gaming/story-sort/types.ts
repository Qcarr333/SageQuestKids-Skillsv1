export type StoryGradeOption = 'Kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';
export type TaskType = 'sequence_order' | 'category_sort' | 'match_pair' | 'puzzle_placement' | 'sentence_builder' | 'math_sort';

export type DraggableTaskItem = { id: string; label: string };
export type DropZoneItem = { id: string; label: string };

export type StorySortTask = {
  id: string;
  grade_level: StoryGradeOption;
  task_type: TaskType;
  instruction: string;
  draggable_items: DraggableTaskItem[];
  drop_zones: DropZoneItem[];
  correct_answers: Record<string, string>;
  hint: string;
  xp_value: number;
};
