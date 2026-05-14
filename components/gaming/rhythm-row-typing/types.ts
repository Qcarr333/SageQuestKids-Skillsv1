export type RhythmGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type RhythmTaskType = 'rhythm_letter'|'rhythm_pattern'|'rhythm_word'|'rhythm_phrase'|'rhythm_home_row'|'rhythm_number_row'|'rhythm_symbol_pattern'|'rhythm_sentence'|'rhythm_coding_pattern';

export type RhythmTask = {
  grade_level: RhythmGrade;
  task_type: RhythmTaskType;
  prompt_sequence: string[];
  bpm: number;
  timing_window: number;
  instruction: string;
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
};
