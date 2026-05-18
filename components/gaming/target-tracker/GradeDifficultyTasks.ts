import { TrackerGradeOption, TrackerTask } from './types';

export const TRACKER_TASKS: Record<TrackerGradeOption, TrackerTask[]> = {
  Kindergarten: [{ id:'k1', grade_level:'Kindergarten', task_type:'click_target_letter', instruction:'Follow the snail and click the letter A.', correct_targets:[{id:'A',label:'A',isCorrect:true}], distractors:[{id:'B',label:'B',isCorrect:false}], object_size:90, object_lifetime:6000, target_speed:1.1, tracking_zone_radius:140, xp_value:18, character:'🐌 Snail Scout', path:'horizontal_wave' }],
  '1st': [{ id:'g1', grade_level:'1st', task_type:'click_target_word', instruction:'Follow the turtle and click the word cat.', correct_targets:[{id:'cat',label:'cat',isCorrect:true}], distractors:[{id:'sun',label:'sun',isCorrect:false}], object_size:82, object_lifetime:5200, target_speed:1.4, tracking_zone_radius:125, xp_value:20, character:'🐢 Turtle Trail', path:'horizontal_wave' }],
  '2nd': [{ id:'g2', grade_level:'2nd', task_type:'click_correct_math_answer', instruction:'Follow the fox and click the answer to 8 + 6.', correct_targets:[{id:'14',label:'14',isCorrect:true}], distractors:[{id:'12',label:'12',isCorrect:false},{id:'16',label:'16',isCorrect:false}], object_size:74, object_lifetime:4500, target_speed:2.2, tracking_zone_radius:110, xp_value:22, character:'🦊 Fox Finder', path:'diagonal' }],
  '3rd': [{ id:'g3', grade_level:'3rd', task_type:'click_correct_category', instruction:'Follow the rabbit and click the adjective.', correct_targets:[{id:'adjective',label:'adjective',isCorrect:true}], distractors:[{id:'planet',label:'planet',isCorrect:false},{id:'cause',label:'cause',isCorrect:false}], object_size:68, object_lifetime:4200, target_speed:2.6, tracking_zone_radius:95, xp_value:24, character:'🐇 Rabbit Runner', path:'circular' }],
  '4th': [{ id:'g4', grade_level:'4th', task_type:'click_target_word', instruction:'Follow the bird and click the equivalent value: 0.5.', correct_targets:[{id:'0.5',label:'0.5',isCorrect:true}], distractors:[{id:'3/4',label:'3/4',isCorrect:false},{id:'estimate',label:'estimate',isCorrect:false}], object_size:62, object_lifetime:3600, target_speed:3.1, tracking_zone_radius:80, xp_value:26, character:'🐦 Bird Breeze', path:'circular' }],
  '5th': [{ id:'g5', grade_level:'5th', task_type:'click_target_word', instruction:'Follow the drone and click the word that means evidence: proof.', correct_targets:[{id:'proof',label:'proof',isCorrect:true}], distractors:[{id:'inference',label:'inference',isCorrect:false},{id:'variable',label:'variable',isCorrect:false},{id:'75%',label:'75%',isCorrect:false}], object_size:56, object_lifetime:3000, target_speed:3.6, tracking_zone_radius:70, xp_value:28, character:'🤖 Drone Dash', path:'figure_eight' }],
};

export function getTrackerTask(grade: TrackerGradeOption): TrackerTask {
  const list = TRACKER_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
