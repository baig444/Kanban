import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useKanban } from "../../context/KanbanContext";
import { Pencil, Trash } from "lucide-react";
import type {ColumnType} from "../../types/kanbanTypes";

export const KanbanCard: React.FC<Props> = ({ card, columnId,index }) => {
  const { isDeleteDialogOpen,
  confirmDeleteCard,
  deleteCard,
  closeDeleteDialog, updateCard } = useKanban();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(card.title);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
  id: card.id,
  data: {
    column: columnId,
  },
});

const getPriority = (index: number) => {
  if (index === 0) return "Important";
  if (index === 1) return "High";
  return "ok";
};


const priorityColor = {
  High: "bg-red-100 text-red-600",
  Important: "bg-blue-500 text-white",
  ok: "bg-green-100 text-green-600",
};




  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const save = () => {
    updateCard(columnId, card.id, value);
    setEditing(false);
  };

  // Stop drag from interactive elements
  const stopDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
  };


    const colorMap: Record<ColumnType, string> = {
    todo: "text-indigo-500",
    "in-progress": "text-orange-400",
    done: "text-green-500",
  };

  const priority = getPriority(index);


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-2xl p-4 shadow hover:shadow-md transition tracking-wider cursor-grab active:cursor-grabbing"
    >
       <span
        className={`text-xs px-3 py-1 rounded-full ${priorityColor[priority]} || "bg-gray-100"}`}
      >
        {priority}
      </span>
<div className="flex items-center gap-4">
        {/* Title */}
      {editing ? (
        <input
          className="w-full border p-1 text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          autoFocus
          onPointerDown={stopDrag}
        />
      ) : (
        <p
          className="font-semibold mt-3 mb-4"
        >
          {card.title}
        </p>
      )}
       <div className={`${colorMap[columnId]}`}>
        <Pencil onClick={() => setEditing(true)} size={15}/>
       </div>
</div>
    
      <div className="flex items-center justify-between">
        {/* Avatars */}
        <div className="flex items-center -space-x-2">
          <Avatar />
          <Avatar />
        </div>

       {/* Delete Model  */}
        {isDeleteDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* backdrop */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={closeDeleteDialog}
    />

    <div className="relative bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl animate-scaleIn tracking-wide">
      <h2 className="text-lg font-semibold mb-3 text-red-600">
        Delete Task?
      </h2>

      <p className="text-sm text-gray-600 mb-5">
        Are you sure you want to delete this task?  
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={closeDeleteDialog}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteCard}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
        <div
          onPointerDown={stopDrag}
          onClick={() => deleteCard(columnId, card.id)}
        >
          <Trash size={16} className="text-red-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

function Avatar() {
  return (
    <img
      className="w-8 h-8 rounded-full border-2 border-white"
      src="https://i.pravatar.cc/40"
      alt="user"
    />
  );
}
