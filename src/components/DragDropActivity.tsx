import type { ReactNode } from 'react';

type Item = {
  id: string;
  node: ReactNode;
};

type Zone = {
  id: string;
  title: string;
};

type Props = {
  items: Item[];
  zones: Zone[];
  placements: Record<string, string>;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, zoneId: string) => void;
};

export function DragDropActivity({ items, zones, placements, selected, onSelect, onMove }: Props) {
  return (
    <div className="grid-2">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className={`drop-zone ${selected ? 'active' : ''}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => selected && onMove(selected, zone.id)}
          onClick={() => selected && onMove(selected, zone.id)}
        >
          <strong>{zone.title}</strong>
          <div className="tray">
            {items
              .filter((item) => placements[item.id] === zone.id)
              .map((item) => (
                <div
                  key={item.id}
                  className={`drag-card ${selected === item.id ? 'selected' : ''}`}
                  draggable
                  onDragStart={() => onSelect(item.id)}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(selected === item.id ? null : item.id);
                  }}
                >
                  {item.node}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
