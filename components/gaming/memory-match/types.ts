export type MemoryGrade='Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type PairType='image_to_image'|'word_to_image'|'word_to_definition'|'equation_to_answer'|'fraction_decimal_pair'|'claim_evidence_pair';
export type MemoryPair={grade_level:MemoryGrade;category:string;pair_type:PairType;card_a:string;card_b:string;xp_value:number;difficulty:'easy'|'medium'|'hard'};
export type MatchCard={id:string;pairId:string;content:string;revealed:boolean;matched:boolean};
