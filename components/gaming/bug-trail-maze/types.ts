export type BugGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type BugTaskType = 'collect_letters'|'collect_shapes'|'collect_numbers_in_order'|'collect_word'|'collect_category_items'|'collect_sequence'|'collect_math_answer'|'collect_sentence_parts'|'collect_equivalent_values'|'collect_claim_evidence_reasoning';

export type TrailItem = { id: string; label: string; correct: boolean };

export type BugTrailTask = {
  grade_level: BugGrade;
  task_type: BugTaskType;
  instruction: string;
  path_difficulty: 'easy'|'medium'|'hard';
  path_width: number;
  correct_items: TrailItem[];
  distractor_items: TrailItem[];
  required_order?: boolean;
  item_size: number;
  xp_value: number;
  hint: string;
  difficulty: 'easy'|'medium'|'hard';
};
