import { StormGrade, StormWord } from './types';
export const WORD_BANK: Record<StormGrade, StormWord[]> = {
  Kindergarten:[{grade_level:'Kindergarten',category:'sight_words',word:'cat',speed:0.45,movement_pattern:'gentle_fall',xp_value:3,difficulty:'easy'},{grade_level:'Kindergarten',category:'sight_words',word:'A',speed:0.4,movement_pattern:'gentle_fall',xp_value:3,difficulty:'easy'}],
  '1st':[{grade_level:'1st',category:'sight_words',word:'tree',speed:0.55,movement_pattern:'soft_sway',xp_value:4,difficulty:'easy'}],
  '2nd':[{grade_level:'2nd',category:'vocabulary',word:'bridge',speed:0.8,movement_pattern:'gentle_fall',xp_value:5,difficulty:'easy'}],
  '3rd':[{grade_level:'3rd',category:'grammar_words',word:'adjective',speed:1.0,movement_pattern:'diagonal_drift',xp_value:6,difficulty:'medium'}],
  '4th':[{grade_level:'4th',category:'science_terms',word:'ecosystem',speed:1.25,movement_pattern:'diagonal_drift',xp_value:8,difficulty:'medium'}],
  '5th':[{grade_level:'5th',category:'science_terms',word:'hypothesis',speed:1.45,movement_pattern:'soft_sway',xp_value:10,difficulty:'hard'}],
};
export const pickWord=(grade:StormGrade)=>{const pool=WORD_BANK[grade]; return pool[Math.floor(Math.random()*pool.length)];};
