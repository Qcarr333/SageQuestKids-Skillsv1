export type CircuitGrade = 'Kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';

export type CircuitTaskType =
  | 'connect_colors'
  | 'connect_shapes'
  | 'sequence_numbers'
  | 'sequence_story'
  | 'build_sentence'
  | 'build_logic_chain'
  | 'build_math_path'
  | 'connect_fraction_relationship'
  | 'connect_vocabulary_flow'
  | 'connect_claim_evidence_reasoning'
  | 'connect_coding_sequence';

export type CircuitComponent = { id: string; label: string; hint?: string };

export type CircuitTask = {
  grade_level: CircuitGrade;
  task_type: CircuitTaskType;
  instruction: string;
  draggable_components: CircuitComponent[];
  target_slots: number;
  correct_connections: Record<string, string>;
  optional_sequence?: string[];
  xp_value: number;
  difficulty: 'easy' | 'medium' | 'hard';
};
