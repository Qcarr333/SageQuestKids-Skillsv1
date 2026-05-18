import { FarmGrade, FarmTask } from './types';

export const TASKS: Record<FarmGrade, FarmTask[]> = {
  Kindergarten: [
    { grade_level:'Kindergarten', task_type:'type_letter', instruction:'Type the letter the chick brought.', prompt:'A', answer:'A', clue:'Letter A', xp_value:1, difficulty:'easy' },
    { grade_level:'Kindergarten', task_type:'build_cvc_word', instruction:'Type the short word.', prompt:'cat', answer:'cat', clue:'A pet that meows.', image_clue:'🐱', xp_value:5, difficulty:'easy' },
  ],
  '1st': [{ grade_level:'1st', task_type:'type_full_word', instruction:'Type the sight word.', prompt:'the', answer:'the', clue:'A common reading word.', xp_value:5, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'type_full_word', instruction:'Type the word the sheep brought.', prompt:'friend', answer:'friend', clue:'A person you like.', xp_value:6, difficulty:'medium' }],
  '3rd': [{ grade_level:'3rd', task_type:'type_from_definition', instruction:'Type the vocabulary word.', prompt:'A person who helps.', answer:'helper', clue:'Starts with h.', xp_value:8, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'build_prefix_root_suffix', instruction:'Type the academic word.', prompt:'A word for judging close value.', answer:'estimate', clue:'Used in math.', xp_value:8, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'type_from_context_clue', instruction:'Type the word that fits.', prompt:'Use ______ to support your claim.', answer:'evidence', clue:'Information that supports an idea.', xp_value:10, difficulty:'hard' }],
};

export function getFarmTask(grade: FarmGrade): FarmTask {
  const list = TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
