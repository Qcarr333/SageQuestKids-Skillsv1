import { PainterGrade, PainterTask } from './types';

export const PAINTER_TASKS: Record<PainterGrade, PainterTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'trace_letter', instruction:'Trace the letter carefully.', target_paths:['A'], precision_requirement:0.55, xp_value:5, difficulty:'easy' }],
  '1st': [{ grade_level:'1st', task_type:'trace_word', instruction:'Trace the word cat.', target_paths:['cat'], precision_requirement:0.6, xp_value:6, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'color_category', instruction:'Color all nouns blue.', target_areas:['dog','tree'], educational_targets:['dog','tree'], precision_requirement:0.62, xp_value:7, difficulty:'medium' }],
  '3rd': [{ grade_level:'3rd', task_type:'trace_path', instruction:'Trace the water cycle path.', target_paths:['water cycle'], precision_requirement:0.68, xp_value:8, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'trace_graph', instruction:'Trace the coordinate path.', target_paths:['coordinate path'], precision_requirement:0.72, xp_value:9, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'highlight_text', instruction:'Highlight the evidence statements.', target_areas:['evidence statement 1','evidence statement 2'], educational_targets:['evidence statement 1','evidence statement 2'], precision_requirement:0.75, xp_value:10, difficulty:'hard' }],
};

export function getPainterTask(grade: PainterGrade): PainterTask {
  const list = PAINTER_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
