import { MathGrade, MathQuestTask } from './types';

const NUMS = ['0','1','2','3','4','5','6','7','8','9'];

export const TASKS: Record<MathGrade, MathQuestTask[]> = {
  Kindergarten: [
    { grade_level:'Kindergarten', task_type:'count_and_type', instruction:'Count and type to light the path.', prompt:'Count 3 stars: ✨✨✨', answer:'3', hint:'How many stars are shown?', allowed_inputs:NUMS, xp_value:2, difficulty:'easy' },
  ],
  '1st': [{ grade_level:'1st', task_type:'addition', instruction:'Type the answer to open the gate.', prompt:'4 + 3 = ?', answer:'7', hint:'Add 4 and 3.', allowed_inputs:NUMS, xp_value:5, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'addition', instruction:'Solve to build the bridge.', prompt:'24 + 8 = ?', answer:'32', hint:'Make 30 first, then add 2.', allowed_inputs:NUMS, xp_value:6, difficulty:'medium' }],
  '3rd': [{ grade_level:'3rd', task_type:'multiplication', instruction:'Power the path with multiplication.', prompt:'7 × 4 = ?', answer:'28', hint:'7 groups of 4.', allowed_inputs:NUMS, xp_value:7, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'fraction_answer', instruction:'Type the fraction answer.', prompt:'Half of 1 is ?', answer:'1/2', hint:'Use slash for fractions.', allowed_inputs:[...NUMS,'/'], xp_value:8, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'decimal_answer', instruction:'Solve to reveal the map path.', prompt:'0.5 + 0.25 = ?', answer:'0.75', hint:'Think quarters and halves.', allowed_inputs:[...NUMS,'.'], xp_value:8, difficulty:'hard' }],
};

export function getMathTask(grade: MathGrade): MathQuestTask {
  const list = TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
