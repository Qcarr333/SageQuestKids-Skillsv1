import { GalaxyGrade, GalaxyTask } from './types';

export const GALAXY_TASKS: Record<GalaxyGrade, GalaxyTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'click_letter', instruction:'Click the letter A to activate the beacon.', correct_targets:[{id:'A',label:'A',correct:true}], distractor_targets:[{id:'B',label:'B',correct:false}], target_speed:0.6, target_size:92, target_lifetime:7000, xp_value:10, difficulty:'easy' }],
  '1st': [{ grade_level:'1st', task_type:'click_word', instruction:'Click the word cat.', correct_targets:[{id:'cat',label:'cat',correct:true}], distractor_targets:[{id:'sun',label:'sun',correct:false}], target_speed:0.8, target_size:86, target_lifetime:6200, xp_value:12, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'click_grammar_category', instruction:'Click all nouns.', correct_targets:[{id:'dog',label:'dog',correct:true},{id:'planet',label:'planet',correct:true}], distractor_targets:[{id:'run',label:'run',correct:false}], target_speed:1.0, target_size:80, target_lifetime:5600, xp_value:16, difficulty:'medium' }],
  '3rd': [{ grade_level:'3rd', task_type:'click_math_answer', instruction:'Click the answer to 6 × 7.', correct_targets:[{id:'42',label:'42',correct:true}], distractor_targets:[{id:'36',label:'36',correct:false}], target_speed:1.2, target_size:74, target_lifetime:5000, xp_value:20, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'click_fraction_relationship', instruction:'Click equivalent fraction values.', correct_targets:[{id:'1/2',label:'1/2',correct:true},{id:'0.5',label:'0.5',correct:true}], distractor_targets:[{id:'1/3',label:'1/3',correct:false}], target_speed:1.6, target_size:68, target_lifetime:4300, xp_value:24, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'click_claim_evidence_reasoning', instruction:'Click claim → evidence → reasoning.', correct_targets:[{id:'claim',label:'Claim',correct:true},{id:'evidence',label:'Evidence',correct:true},{id:'reasoning',label:'Reasoning',correct:true}], distractor_targets:[{id:'setting',label:'Setting',correct:false}], target_speed:2.0, target_size:62, target_lifetime:3600, xp_value:28, difficulty:'hard' }],
};

export function getGalaxyTask(grade: GalaxyGrade): GalaxyTask {
  const list=GALAXY_TASKS[grade];
  return list[Math.floor(Math.random()*list.length)];
}
