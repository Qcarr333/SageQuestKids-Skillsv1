export type ShakerzGrade='Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type ClickTarget={label:string;correct:boolean};
export type Scenario={grade_level:ShakerzGrade;scenario_type:string;educational_category:string;objective:string;clickable_targets:ClickTarget[];environment_reactions:string[];xp_value:number;difficulty:'easy'|'medium'|'hard'};
