import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import { useKanban } from "../../context/KanbanContext";
import type {Column,ColumnType } from "../../context/KanbanContext";


export const KanbanColumn: React.FC<{ column: Column }> = ({ column }) => {
  const {     
    isDialogOpen,
    newTitle,
    setNewTitle,
    confirmAddCard,
    closeDialog,addCard } = useKanban();
  const { setNodeRef } = useDroppable({
  id: column.id,
  data: {
    column: column.id,
  },
});


  // 🔥 Color by column type
  const colorMap: Record<ColumnType, string> = {
    todo: "bg-indigo-500",
    "in-progress": "bg-orange-400",
    done: "bg-green-500",
  };

  return (
    <div ref={setNodeRef} className="bg-[#f2f3f9] rounded-2xl p-5 shadow-sm w-full tracking-wide">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {column.title}
        </h2>
                <span className="text-sm bg-white px-3 py-1 rounded-full shadow">
          {column.cards.length} Total
        </span>
      </div>

      {/* Add Button */}
      <button
        onClick={() => addCard(column.id)}
        className={`w-full mb-5 text-white py-2 rounded-xl flex items-center justify-center gap-2 ${colorMap[column.id]}`}
      >
        + Add New Task
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeDialog}
          />

          {/* modal */}
          <div className="relative bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl animate-scaleIn">
            <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

            <input
              autoFocus
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmAddCard()}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddCard}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {column.cards.map((card:any,index:Number) => (
          <KanbanCard key={card.id} card={card} columnId={column.id} index={index} />
        ))}
      </div>
    </div>
  );
};
