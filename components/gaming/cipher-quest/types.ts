export type CipherGrade='Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type PuzzleType='symbol_match'|'picture_substitution'|'letter_substitution'|'simple_shift_cipher'|'word_scramble'|'clue_chain';
export type CipherPuzzle={grade_level:CipherGrade;puzzle_type:PuzzleType;story_text:string;encoded_text:string;clues:string[];valid_answers:string[];optional_hint?:string;xp_value:number;difficulty:'easy'|'medium'|'hard';environment:string};
