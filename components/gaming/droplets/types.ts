export type DropletGrade='Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type DropletCategory='phonics'|'sight_words'|'spelling'|'vocabulary'|'science_terms'|'math_terms'|'coding_terms'|'grammar_words';
export type DropletWord={grade_level:DropletGrade;category:DropletCategory;word:string;letter_speed:number;droplet_spacing:number;xp_value:number;difficulty:'easy'|'medium'|'hard'};
export type FallingLetter={id:string;letter:string;index:number;y:number;stabilized:boolean};
