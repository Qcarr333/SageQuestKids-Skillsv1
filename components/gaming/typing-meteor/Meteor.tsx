import { ActiveMeteor } from './types';

type MeteorProps = {
  meteor: ActiveMeteor;
  highlighted?: boolean;
  reducedMotion: boolean;
  sizeClass: string;
};

export function Meteor({ meteor, highlighted, reducedMotion, sizeClass }: MeteorProps) {
  return (
    <div
      className={`absolute rounded-full px-4 py-3 font-black tracking-wide text-white shadow-lg ring-2 ring-white/30 ${sizeClass} ${
        highlighted ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gradient-to-r from-purple-500 to-sky-500'
      } ${reducedMotion ? '' : 'transition-transform duration-100'}`}
      style={{ top: `${meteor.y}%`, left: `${meteor.x}%`, transform: 'translate(-50%, -50%)' }}
      aria-label={`Meteor prompt ${meteor.text}`}
    >
      {meteor.text}
    </div>
  );
}
