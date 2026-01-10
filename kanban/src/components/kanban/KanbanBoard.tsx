import { DndContext,PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { useKanban } from "../../context/KanbanContext";
import { KanbanColumn } from "./KanbanColumn";
import type {ColumnType} from "../../types/kanbanTypes";

export const KanbanBoard = () => {
  const { columns, moveCard } = useKanban();

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;

  const from = active.data.current?.column as ColumnType;
  const to = over.data.current?.column as ColumnType;

  if (!from || !to) return;

  moveCard(
    from,
    to,
    active.id as string,
    over.id as string
  );
};



  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, 
    },
  })
);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between tracking-wide border-b pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Kanban Project</h1>
          <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
            Faisal Baig
          </span>
        </div>

      </div>
    </div>
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {columns.map(col => (
          <KanbanColumn key={col.id} column={col} />
        ))}
      </div>
    </DndContext>
  );
};
