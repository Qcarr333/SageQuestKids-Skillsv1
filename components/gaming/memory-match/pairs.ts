import { MemoryGrade, MemoryPair } from './types';
export const MEMORY_PAIRS: Record<MemoryGrade, MemoryPair[]> = {
  Kindergarten:[{grade_level:'Kindergarten',category:'letters',pair_type:'image_to_image',card_a:'A',card_b:'A',xp_value:5,difficulty:'easy'},{grade_level:'Kindergarten',category:'shapes',pair_type:'image_to_image',card_a:'triangle',card_b:'triangle',xp_value:5,difficulty:'easy'}],
  '1st':[{grade_level:'1st',category:'sight_words',pair_type:'word_to_image',card_a:'sun',card_b:'☀️ sun',xp_value:6,difficulty:'easy'}],
  '2nd':[{grade_level:'2nd',category:'math',pair_type:'equation_to_answer',card_a:'5 + 2',card_b:'7',xp_value:8,difficulty:'easy'}],
  '3rd':[{grade_level:'3rd',category:'science',pair_type:'word_to_definition',card_a:'evaporation',card_b:'water turning into vapor',xp_value:10,difficulty:'medium'}],
  '4th':[{grade_level:'4th',category:'fractions',pair_type:'fraction_decimal_pair',card_a:'1/2',card_b:'0.5',xp_value:12,difficulty:'medium'}],
  '5th':[{grade_level:'5th',category:'science',pair_type:'word_to_definition',card_a:'hypothesis',card_b:'a scientific prediction based on evidence',xp_value:14,difficulty:'hard'}],
};
export const getPairs=(grade:MemoryGrade,count:number)=>[...MEMORY_PAIRS[grade]].slice(0,count);
