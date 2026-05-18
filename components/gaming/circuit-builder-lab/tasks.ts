import { CircuitGrade, CircuitTask } from './types';

export const CIRCUIT_TASKS: Record<CircuitGrade, CircuitTask[]> = {
  Kindergarten: [
    { grade_level: 'Kindergarten', task_type: 'connect_colors', instruction: 'Connect the red wire to the red socket, then blue to blue.', draggable_components: [{ id: 'red_wire', label: 'Red Wire', hint: 'Starts at red battery.' }, { id: 'blue_wire', label: 'Blue Wire' }], target_slots: 2, correct_connections: { slot1: 'red_wire', slot2: 'blue_wire' }, optional_sequence: ['red_wire', 'blue_wire'], xp_value: 12, difficulty: 'easy' },
  ],
  '1st': [
    { grade_level: '1st', task_type: 'sequence_numbers', instruction: 'Build the number path in order: 1 → 2 → 3.', draggable_components: [{ id: 'one', label: '1' }, { id: 'two', label: '2' }, { id: 'three', label: '3' }], target_slots: 3, correct_connections: { slot1: 'one', slot2: 'two', slot3: 'three' }, optional_sequence: ['one', 'two', 'three'], xp_value: 15, difficulty: 'easy' },
  ],
  '2nd': [
    { grade_level: '2nd', task_type: 'build_math_path', instruction: 'Connect the addition circuit in the correct order.', draggable_components: [{ id: '4_plus_2', label: '4 + 2' }, { id: 'equals', label: '=' }, { id: 'six', label: '6' }], target_slots: 3, correct_connections: { slot1: '4_plus_2', slot2: 'equals', slot3: 'six' }, optional_sequence: ['4_plus_2', 'equals', 'six'], xp_value: 20, difficulty: 'easy' },
  ],
  '3rd': [
    { grade_level: '3rd', task_type: 'build_logic_chain', instruction: 'Activate the robot: Command → Action → Result.', draggable_components: [{ id: 'command', label: 'Command' }, { id: 'action', label: 'Action' }, { id: 'result', label: 'Result' }, { id: 'noise', label: 'Random Note' }], target_slots: 3, correct_connections: { slot1: 'command', slot2: 'action', slot3: 'result' }, optional_sequence: ['command', 'action', 'result'], xp_value: 24, difficulty: 'medium' },
  ],
  '4th': [
    { grade_level: '4th', task_type: 'connect_fraction_relationship', instruction: 'Complete the fraction energy flow: 1/2 → 0.5 → 50%.', draggable_components: [{ id: 'one_half', label: '1/2' }, { id: 'point_five', label: '0.5' }, { id: 'fifty_percent', label: '50%' }, { id: 'one_third', label: '1/3' }], target_slots: 3, correct_connections: { slot1: 'one_half', slot2: 'point_five', slot3: 'fifty_percent' }, optional_sequence: ['one_half', 'point_five', 'fifty_percent'], xp_value: 28, difficulty: 'medium' },
  ],
  '5th': [
    { grade_level: '5th', task_type: 'connect_claim_evidence_reasoning', instruction: 'Build the argument logic chain: Claim → Evidence → Reasoning.', draggable_components: [{ id: 'claim', label: 'Claim' }, { id: 'reasoning', label: 'Reasoning' }, { id: 'evidence', label: 'Evidence' }, { id: 'topic', label: 'Topic Sentence' }], target_slots: 3, correct_connections: { slot1: 'claim', slot2: 'evidence', slot3: 'reasoning' }, optional_sequence: ['claim', 'evidence', 'reasoning'], xp_value: 35, difficulty: 'hard' },
  ],
};

export function getCircuitTask(grade: CircuitGrade): CircuitTask {
  const tasks = CIRCUIT_TASKS[grade];
  return tasks[Math.floor(Math.random() * tasks.length)];
}
