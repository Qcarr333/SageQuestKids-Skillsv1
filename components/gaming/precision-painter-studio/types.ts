export type PainterGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type PainterTaskType = 'trace_letter'|'trace_word'|'trace_number'|'trace_path'|'connect_dots'|'color_shape'|'color_category'|'outline_diagram'|'highlight_text'|'annotate_paragraph'|'trace_geometry'|'trace_graph';

export type PainterTask = {
  grade_level: PainterGrade;
  task_type: PainterTaskType;
  instruction: string;
  target_paths?: string[];
  target_areas?: string[];
  educational_targets?: string[];
  precision_requirement: number;
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
};
