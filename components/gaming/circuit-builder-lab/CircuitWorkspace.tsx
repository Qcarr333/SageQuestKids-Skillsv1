import { CircuitComponent } from './types';
import { DraggableComponent } from './DraggableComponent';
import { TargetSlot } from './TargetSlot';

type Props = {
  items: CircuitComponent[];
  slots: string[];
  placements: Record<string, string | undefined>;
  selectedComponentId: string | null;
  largeTargets: boolean;
  highlightedSlots: string[];
  onSelectComponent: (id: string) => void;
  onDropValue: (slot: string, componentId: string) => void;
};

export function CircuitWorkspace({ items, slots, placements, selectedComponentId, largeTargets, highlightedSlots, onSelectComponent, onDropValue }: Props) {
  const placedIds = new Set(Object.values(placements).filter(Boolean));

  return (
    <section className="grid gap-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-sky-300/30 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.20),transparent_40%),#020617] p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {slots.map((slot) => (
            <TargetSlot
              key={slot}
              slot={slot}
              value={items.find((item) => item.id === placements[slot])?.label}
              glow={Boolean(placements[slot]) || highlightedSlots.includes(slot)}
              large={largeTargets}
              onDropValue={onDropValue}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-2xl bg-slate-950/60 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Components</p>
        <div className="grid gap-2">
          {items.map((item) => (
            <DraggableComponent
              key={item.id}
              item={item}
              isPlaced={placedIds.has(item.id)}
              isSelected={selectedComponentId === item.id}
              onSelect={onSelectComponent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
