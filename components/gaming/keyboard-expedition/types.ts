export type ExpeditionGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type ExpeditionTaskType = 'type_letter'|'type_word'|'type_direction'|'type_short_phrase'|'type_sentence'|'type_from_clue'|'type_from_context'|'type_sequence'|'type_coordinates'|'type_command';

export type ExpeditionTask = {
  grade_level: ExpeditionGrade;
  task_type: ExpeditionTaskType;
  instruction: string;
  prompt: string;
  answer: string;
  clue: string;
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
  visual_support?: string;
};
