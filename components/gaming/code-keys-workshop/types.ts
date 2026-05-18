export type WorkshopGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type WorkshopTaskType = 'type_pattern'|'type_symbol'|'type_sequence'|'type_command'|'type_variable'|'type_logic_chain'|'type_number_symbol_combo'|'type_bracket_pair'|'type_robot_command'|'type_pseudocode';

export type WorkshopTask = {
  grade_level: WorkshopGrade;
  task_type: WorkshopTaskType;
  instruction: string;
  prompt: string;
  answer: string;
  clue: string;
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
  highlighted_keys?: string[];
};
