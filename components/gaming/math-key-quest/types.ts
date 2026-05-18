export type MathGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type MathTaskType = 'type_number'|'count_and_type'|'addition'|'subtraction'|'multiplication'|'division'|'missing_number'|'place_value'|'fraction_answer'|'decimal_answer'|'variable_answer'|'order_of_operations'|'word_problem_number_answer';
export type MathQuestTask = {
  grade_level: MathGrade;
  task_type: MathTaskType;
  instruction: string;
  prompt: string;
  answer: string;
  hint: string;
  allowed_inputs: string[];
  xp_value: number;
  difficulty: 'easy'|'medium'|'hard';
  visual_support?: string;
};
