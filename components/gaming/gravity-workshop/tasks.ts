import { GravityGrade, GravityPuzzle } from './types';
export const GRAVITY_PUZZLES: Record<GravityGrade, GravityPuzzle[]> = {
  Kindergarten:[{grade_level:'Kindergarten',task_type:'stack_shapes',instruction:'Stack 2 shapes so they stay above the glowing line.',available_shapes:['square','circle','triangle'],goal_conditions:{minStableObjects:2},xp_value:14,difficulty:'easy'}],
  '1st':[{grade_level:'1st',task_type:'guide_ball',instruction:'Use one ramp to guide the circle toward the target zone.',available_shapes:['ramp','circle','square'],goal_conditions:{ballInTarget:true},xp_value:18,difficulty:'easy'}],
  '2nd':[{grade_level:'2nd',task_type:'support_structure',instruction:'Support the platform with stable shapes.',available_shapes:['triangle','rectangle','square','circle'],goal_conditions:{minStableObjects:3},xp_value:22,difficulty:'medium'}],
  '3rd':[{grade_level:'3rd',task_type:'balance_platform',instruction:'Balance at least 3 objects above the line.',available_shapes:['rectangle','triangle','circle','ramp'],goal_conditions:{minStableObjects:3},xp_value:25,difficulty:'medium'}],
  '4th':[{grade_level:'4th',task_type:'maintain_balance',instruction:'Stabilize 4 objects with efficient placement.',available_shapes:['rectangle','triangle','circle','square','ramp'],goal_conditions:{minStableObjects:4},xp_value:30,difficulty:'hard'}],
  '5th':[{grade_level:'5th',task_type:'maintain_balance',instruction:'Keep 4+ objects stable and guide the circle into target.',available_shapes:['rectangle','triangle','circle','square','ramp'],goal_conditions:{minStableObjects:4,ballInTarget:true},xp_value:36,difficulty:'hard'}],
};
export function getGravityPuzzle(grade: GravityGrade){const list=GRAVITY_PUZZLES[grade]; return list[Math.floor(Math.random()*list.length)];}
