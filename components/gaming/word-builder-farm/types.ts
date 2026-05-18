export type FarmGrade = 'Kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';
export type TaskType = 'type_letter'|'type_missing_letter'|'type_full_word'|'match_sound_to_letter'|'build_cvc_word'|'build_sight_word'|'type_from_definition'|'type_from_context_clue'|'build_prefix_root_suffix';

export type FarmTask = {
  grade_level: FarmGrade;
  task_type: TaskType;
  instruction: string;
  prompt: string;
  answer: string;
  clue?: string;
  image_clue?: string;
  letter_sequence?: string[];
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
};
