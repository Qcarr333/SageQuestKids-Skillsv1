export type StormGrade='Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type WordCategory='sight_words'|'vocabulary'|'spelling'|'math_terms'|'science_terms'|'coding_terms'|'grammar_words';
export type MovementPattern='gentle_fall'|'diagonal_drift'|'soft_sway';
export type StormWord={grade_level:StormGrade;category:WordCategory;word:string;speed:number;movement_pattern:MovementPattern;xp_value:number;difficulty:'easy'|'medium'|'hard'};
export type ActiveStormWord=StormWord & {id:string;x:number;y:number};
