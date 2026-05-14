import { RhythmGrade, RhythmTask } from './types';

export const RHYTHM_TASKS: Record<RhythmGrade, RhythmTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'rhythm_letter', prompt_sequence:['A','S','M','T'], bpm:58, timing_window:500, instruction:'Type the glowing letters in a calm rhythm.', xp_value:1, difficulty:'easy' }],
  '1st': [{ grade_level:'1st', task_type:'rhythm_pattern', prompt_sequence:['A','S','A','S'], bpm:64, timing_window:470, instruction:'Follow the simple pattern.', xp_value:2, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'rhythm_word', prompt_sequence:['cat','run','the'], bpm:70, timing_window:450, instruction:'Type the words with the rhythm.', xp_value:4, difficulty:'easy' }],
  '3rd': [{ grade_level:'3rd', task_type:'rhythm_phrase', prompt_sequence:['ASDF','planet','type fast'], bpm:78, timing_window:410, instruction:'Keep a smooth typing flow.', xp_value:6, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'rhythm_symbol_pattern', prompt_sequence:['x','=','5','fraction'], bpm:88, timing_window:360, instruction:'Follow the mixed symbol and word rhythm.', xp_value:8, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'rhythm_coding_pattern', prompt_sequence:['if','x','==','5'], bpm:95, timing_window:330, instruction:'Follow the coding rhythm pattern.', xp_value:10, difficulty:'hard' }],
};

export function getRhythmTask(grade: RhythmGrade): RhythmTask {
  const list = RHYTHM_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
