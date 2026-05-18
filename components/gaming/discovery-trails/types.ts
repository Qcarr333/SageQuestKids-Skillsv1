export type TrailGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type TrailEventType = 'directional_choice'|'resource_problem'|'vocabulary_prompt'|'typing_command'|'comprehension_event'|'map_navigation';
export type EnvironmentType = 'forest'|'cave'|'mountain'|'desert'|'ocean'|'jungle'|'snow'|'ruins'|'observatory'|'science_station';
export type TrailEvent = { grade_level: TrailGrade; event_type: TrailEventType; environment: EnvironmentType; story_text: string; prompt: string; valid_answers: string[]; optional_hint?: string; xp_value: number; difficulty:'easy'|'medium'|'hard' };
