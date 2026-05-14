import { WorkshopGrade, WorkshopTask } from './types';

export const WORKSHOP_TASKS: Record<WorkshopGrade, WorkshopTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'type_symbol', instruction:'Type the symbol to power the light.', prompt:'=', answer:'=', clue:'Find equals near the number row.', xp_value:2, difficulty:'easy', highlighted_keys:['='] }],
  '1st': [{ grade_level:'1st', task_type:'type_pattern', instruction:'Type the repeat pattern.', prompt:'1 2 1 2', answer:'1 2 1 2', clue:'Repeat the pattern.', xp_value:4, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'type_sequence', instruction:'Type the repair sequence.', prompt:'A1 B2', answer:'A1 B2', clue:'Follow the sequence carefully.', xp_value:5, difficulty:'easy' }],
  '3rd': [{ grade_level:'3rd', task_type:'type_command', instruction:'Type the workshop command.', prompt:'x = 4', answer:'x = 4', clue:'Variable equals value.', xp_value:6, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'type_variable', instruction:'Type the variable instruction.', prompt:'score = 10', answer:'score = 10', clue:'Set score to ten.', xp_value:8, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'type_pseudocode', instruction:'Type the activation command.', prompt:'if score > 10', answer:'if score > 10', clue:'Activates when score is greater than 10.', xp_value:10, difficulty:'hard' }],
};

export function getWorkshopTask(grade: WorkshopGrade): WorkshopTask {
  const list = WORKSHOP_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
