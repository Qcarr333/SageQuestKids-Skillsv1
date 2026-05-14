import { FingerId } from './types';

export const KEYBOARD_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0','-','='],
  ['Q','W','E','R','T','Y','U','I','O','P','[',']'],
  ['A','S','D','F','G','H','J','K','L',';'],
  ['Z','X','C','V','B','N','M',',','.','/'],
  ['SPACE'],
];

export const HOME_ROW = ['A','S','D','F','J','K','L',';'];

export const FINGER_BY_KEY: Record<string, FingerId> = {
  A:'left_pinky',Q:'left_pinky',Z:'left_pinky',1:'left_pinky',
  S:'left_ring',W:'left_ring',X:'left_ring',2:'left_ring',
  D:'left_middle',E:'left_middle',C:'left_middle',3:'left_middle',
  F:'left_index',G:'left_index',R:'left_index',T:'left_index',V:'left_index',B:'left_index',4:'left_index',5:'left_index',
  H:'right_index',J:'right_index',Y:'right_index',U:'right_index',N:'right_index',M:'right_index',6:'right_index',7:'right_index',
  K:'right_middle',I:'right_middle',',':'right_middle',8:'right_middle',
  L:'right_ring',O:'right_ring','.':'right_ring',9:'right_ring',
  ';':'right_pinky',P:'right_pinky','/':'right_pinky','[':'right_pinky',']':'right_pinky','-':'right_pinky','=':'right_pinky',0:'right_pinky',
  SPACE:'thumb',
};
