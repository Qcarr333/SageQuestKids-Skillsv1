export type GalaxyGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type GalaxyTaskType = 'click_letter'|'click_shape'|'click_number'|'click_word'|'click_math_answer'|'click_grammar_category'|'click_vocabulary'|'click_sequence'|'click_fraction_relationship'|'click_claim_evidence_reasoning';

export type GalaxyTarget = { id:string; label:string; correct:boolean };
export type GalaxyTask = {
  grade_level: GalaxyGrade;
  task_type: GalaxyTaskType;
  instruction: string;
  correct_targets: GalaxyTarget[];
  distractor_targets: GalaxyTarget[];
  target_speed: number;
  target_size: number;
  target_lifetime: number;
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
};
