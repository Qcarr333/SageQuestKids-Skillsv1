import { DropletGrade, DropletWord } from './types';
export const DROPLET_WORDS: Record<DropletGrade, DropletWord[]> = {
  Kindergarten:[{grade_level:'Kindergarten',category:'phonics',word:'cat',letter_speed:0.45,droplet_spacing:1500,xp_value:5,difficulty:'easy'}],
  '1st':[{grade_level:'1st',category:'sight_words',word:'fish',letter_speed:0.6,droplet_spacing:1300,xp_value:7,difficulty:'easy'}],
  '2nd':[{grade_level:'2nd',category:'vocabulary',word:'bridge',letter_speed:0.85,droplet_spacing:1200,xp_value:10,difficulty:'medium'}],
  '3rd':[{grade_level:'3rd',category:'grammar_words',word:'science',letter_speed:1.05,droplet_spacing:1000,xp_value:12,difficulty:'medium'}],
  '4th':[{grade_level:'4th',category:'science_terms',word:'ecosystem',letter_speed:1.25,droplet_spacing:900,xp_value:14,difficulty:'hard'}],
  '5th':[{grade_level:'5th',category:'science_terms',word:'hypothesis',letter_speed:1.45,droplet_spacing:800,xp_value:16,difficulty:'hard'}],
};
export const pickDropletWord=(grade:DropletGrade)=>{const pool=DROPLET_WORDS[grade]; return pool[Math.floor(Math.random()*pool.length)];};
