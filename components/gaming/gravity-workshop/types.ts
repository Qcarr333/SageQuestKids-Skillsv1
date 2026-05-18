export type GravityGrade = 'Kindergarten'|'1st'|'2nd'|'3rd'|'4th'|'5th';
export type ShapeType = 'square'|'rectangle'|'circle'|'triangle'|'ramp';
export type PuzzleType = 'stack_shapes'|'balance_platform'|'guide_ball'|'support_structure'|'maintain_balance';
export type GravityPuzzle = { grade_level: GravityGrade; task_type: PuzzleType; instruction: string; available_shapes: ShapeType[]; goal_conditions: { minStableObjects?: number; ballInTarget?: boolean }; xp_value: number; difficulty:'easy'|'medium'|'hard'; };
export type PlacedShape = { id:string; type:ShapeType; x:number; y:number; rotation:number; vy:number; stableTicks:number };
