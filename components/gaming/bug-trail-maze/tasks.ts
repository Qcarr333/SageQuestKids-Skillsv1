import { BugGrade, BugTrailTask } from './types';

export const TRAIL_TASKS: Record<BugGrade, BugTrailTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'collect_letters', instruction:'Guide the ladybug and collect letter A flowers.', path_difficulty:'easy', path_width:140, correct_items:[{id:'A',label:'A',correct:true}], distractor_items:[{id:'B',label:'B',correct:false}], required_order:false, item_size:74, xp_value:12, hint:'Collect the A flower.' , difficulty:'easy'}],
  '1st': [{ grade_level:'1st', task_type:'collect_word', instruction:'Collect the word cat along the trail.', path_difficulty:'easy', path_width:125, correct_items:[{id:'cat',label:'cat',correct:true}], distractor_items:[{id:'sun',label:'sun',correct:false}], required_order:false, item_size:70, xp_value:14, hint:'Look for cat.', difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'collect_category_items', instruction:'Collect only verbs.', path_difficulty:'medium', path_width:110, correct_items:[{id:'jump',label:'jump',correct:true}], distractor_items:[{id:'dog',label:'dog',correct:false}], required_order:false, item_size:64, xp_value:16, hint:'Verbs are action words.', difficulty:'medium' }],
  '3rd': [{ grade_level:'3rd', task_type:'collect_math_answer', instruction:'Collect the answer to 6 × 7.', path_difficulty:'medium', path_width:95, correct_items:[{id:'42',label:'42',correct:true}], distractor_items:[{id:'36',label:'36',correct:false}], required_order:false, item_size:60, xp_value:20, hint:'6 groups of 7.', difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'collect_equivalent_values', instruction:'Collect equivalent fractions.', path_difficulty:'hard', path_width:80, correct_items:[{id:'1/2',label:'1/2',correct:true},{id:'2/4',label:'2/4',correct:true}], distractor_items:[{id:'3/4',label:'3/4',correct:false}], required_order:false, item_size:56, xp_value:24, hint:'Equivalent fractions represent the same amount.', difficulty:'hard' }],
  '5th': [{ grade_level:'5th', task_type:'collect_claim_evidence_reasoning', instruction:'Collect claim, evidence, reasoning in order.', path_difficulty:'hard', path_width:70, correct_items:[{id:'claim',label:'Claim',correct:true},{id:'evidence',label:'Evidence',correct:true},{id:'reasoning',label:'Reasoning',correct:true}], distractor_items:[{id:'setting',label:'Setting',correct:false}], required_order:true, item_size:52, xp_value:28, hint:'Claim first, then evidence, then reasoning.', difficulty:'hard' }],
};

export function getTrailTask(grade: BugGrade): BugTrailTask {
  const list = TRAIL_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
