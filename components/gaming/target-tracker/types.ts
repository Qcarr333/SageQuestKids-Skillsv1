export type TrackerGradeOption = 'Kindergarten' | '1st' | '2nd' | '3rd' | '4th' | '5th';
export type TrackerTaskType = 'click_target_letter' | 'click_target_word' | 'click_correct_math_answer' | 'click_correct_category' | 'follow_target_only' | 'collect_sequence';

export type LearningTarget = { id: string; label: string; isCorrect: boolean };
export type TrackerTask = {
  id: string;
  grade_level: TrackerGradeOption;
  task_type: TrackerTaskType;
  instruction: string;
  correct_targets: LearningTarget[];
  distractors: LearningTarget[];
  object_size: number;
  object_lifetime: number;
  target_speed: number;
  tracking_zone_radius: number;
  xp_value: number;
  character: string;
  path: 'horizontal_wave' | 'diagonal' | 'circular' | 'figure_eight';
};

export type SpawnedObject = LearningTarget & { x: number; y: number; bornAt: number; lifetime: number; size: number };
