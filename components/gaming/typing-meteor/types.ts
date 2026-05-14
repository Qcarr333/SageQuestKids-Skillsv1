export type GradeOption = 'Kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';

export type MeteorPromptKind = 'letter' | 'word' | 'math' | 'phrase';

export type MeteorPrompt = {
  id: string;
  text: string;
  kind: MeteorPromptKind;
};

export type ActiveMeteor = MeteorPrompt & {
  y: number;
  speed: number;
  x: number;
  bornAt: number;
};
