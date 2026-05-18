import { ExpeditionGrade, ExpeditionTask } from './types';

export const EXPEDITION_TASKS: Record<ExpeditionGrade, ExpeditionTask[]> = {
  Kindergarten: [{ grade_level:'Kindergarten', task_type:'type_letter', instruction:'Type the rune letter to light the map.', prompt:'A', answer:'A', clue:'Single letter clue.', xp_value:1, difficulty:'easy' }],
  '1st': [{ grade_level:'1st', task_type:'type_word', instruction:'Type the command to open the path.', prompt:'OPEN', answer:'OPEN', clue:'Short command word.', xp_value:4, difficulty:'easy' }],
  '2nd': [{ grade_level:'2nd', task_type:'type_short_phrase', instruction:'Type the clue to unlock the gate.', prompt:'OPEN THE GATE', answer:'OPEN THE GATE', clue:'The gate responds to typed commands.', xp_value:6, difficulty:'easy' }],
  '3rd': [{ grade_level:'3rd', task_type:'type_sentence', instruction:'Type the instruction to activate the bridge.', prompt:'MOVE NORTH TO THE CAVE', answer:'MOVE NORTH TO THE CAVE', clue:'Follow map directions.', xp_value:8, difficulty:'medium' }],
  '4th': [{ grade_level:'4th', task_type:'type_sentence', instruction:'Type the journal instruction.', prompt:'RESTORE POWER TO THE OBSERVATORY', answer:'RESTORE POWER TO THE OBSERVATORY', clue:'Longer expedition command.', xp_value:10, difficulty:'medium' }],
  '5th': [{ grade_level:'5th', task_type:'type_from_context', instruction:'Type the vocabulary word that completes the log.', prompt:'The explorers used the hidden map as _____ to support their theory.', answer:'evidence', clue:'Information supporting a claim.', xp_value:12, difficulty:'hard' }],
};

export function getExpeditionTask(grade: ExpeditionGrade): ExpeditionTask {
  const list = EXPEDITION_TASKS[grade];
  return list[Math.floor(Math.random() * list.length)];
}
