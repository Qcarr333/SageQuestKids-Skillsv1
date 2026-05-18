import { StoryGradeOption, StorySortTask } from './types';

export const TASKS_BY_GRADE: Record<StoryGradeOption, StorySortTask[]> = {
  Kindergarten: [{
    id: 'k-shapes', grade_level: 'Kindergarten', task_type: 'puzzle_placement',
    instruction: 'Drag each shape into the matching shape zone.',
    draggable_items: [{id:'circle',label:'● Circle'},{id:'square',label:'■ Square'},{id:'triangle',label:'▲ Triangle'}],
    drop_zones: [{id:'circle-zone',label:'Circle'},{id:'square-zone',label:'Square'},{id:'triangle-zone',label:'Triangle'}],
    correct_answers: { circle:'circle-zone', square:'square-zone', triangle:'triangle-zone' },
    hint: 'Match the shape symbol and name.', xp_value: 15,
  }],
  '1st': [{
    id:'1-events', grade_level:'1st', task_type:'sequence_order',
    instruction:'Put the picture-story events in order: first, next, last.',
    draggable_items:[{id:'wake',label:'Wake up'},{id:'eat',label:'Eat breakfast'},{id:'school',label:'Go to school'}],
    drop_zones:[{id:'first',label:'First'},{id:'next',label:'Next'},{id:'last',label:'Last'}],
    correct_answers:{wake:'first',eat:'next',school:'last'}, hint:'Think about what happens earliest in the day.', xp_value: 18,
  }],
  '2nd': [{
    id:'2-grammar', grade_level:'2nd', task_type:'category_sort',
    instruction:'Drag each word into noun or verb.',
    draggable_items:[{id:'run',label:'run'},{id:'dog',label:'dog'},{id:'jump',label:'jump'},{id:'park',label:'park'}],
    drop_zones:[{id:'noun',label:'Noun'},{id:'verb',label:'Verb'}],
    correct_answers:{run:'verb',dog:'noun',jump:'verb',park:'noun'}, hint:'A verb is an action word.', xp_value: 20,
  }],
  '3rd': [{
    id:'3-grammar', grade_level:'3rd', task_type:'category_sort',
    instruction:'Drag each word into noun, verb, or adjective.',
    draggable_items:[{id:'blue',label:'blue'},{id:'run3',label:'run'},{id:'planet',label:'planet'},{id:'quick',label:'quick'}],
    drop_zones:[{id:'noun',label:'Noun'},{id:'verb',label:'Verb'},{id:'adjective',label:'Adjective'}],
    correct_answers:{blue:'adjective',run3:'verb',planet:'noun',quick:'adjective'}, hint:'Adjectives describe nouns.', xp_value: 22,
  }],
  '4th': [{
    id:'4-parts', grade_level:'4th', task_type:'sentence_builder',
    instruction:'Sort sentence parts into subject, predicate, adjective, adverb.',
    draggable_items:[{id:'students',label:'students'},{id:'study',label:'study'},{id:'carefully',label:'carefully'},{id:'curious',label:'curious'}],
    drop_zones:[{id:'subject',label:'Subject'},{id:'predicate',label:'Predicate'},{id:'adjective',label:'Adjective'},{id:'adverb',label:'Adverb'}],
    correct_answers:{students:'subject',study:'predicate',carefully:'adverb',curious:'adjective'}, hint:'Adverbs often describe how actions happen.', xp_value: 24,
  }],
  '5th': [{
    id:'5-cer', grade_level:'5th', task_type:'category_sort',
    instruction:'Sort each statement into claim, evidence, or reasoning.',
    draggable_items:[{id:'claim',label:'Plants need sunlight to grow.'},{id:'evidence',label:'Our class plants near windows grew taller.'},{id:'reasoning',label:'Sunlight helps plants make food.'}],
    drop_zones:[{id:'claim-zone',label:'Claim'},{id:'evidence-zone',label:'Evidence'},{id:'reason-zone',label:'Reasoning'}],
    correct_answers:{claim:'claim-zone',evidence:'evidence-zone',reasoning:'reason-zone'}, hint:'Evidence gives proof for a claim.', xp_value: 26,
  }],
};

export function getTaskForGrade(grade: StoryGradeOption): StorySortTask {
  const list = TASKS_BY_GRADE[grade];
  return list[Math.floor(Math.random() * list.length)];
}
