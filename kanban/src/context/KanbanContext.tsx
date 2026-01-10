import React, { createContext, useContext, useEffect, useState } from "react";
import type {Column,ColumnType,Card } from "../types/kanbanTypes";

interface KanbanContextType {
  columns: Column[];
  addCard: (columnId: ColumnType) => void;
  confirmAddCard: () => void;
  deleteCard: (columnId: ColumnType, cardId: string) => void;
  confirmDeleteCard: () => void;
  closeDialog: () => void;
  closeDeleteDialog: () => void;
  updateCard: (columnId: ColumnType, cardId: string, title: string) => void;
  moveCard: (fromColumn: ColumnType, toColumn: ColumnType, card: Card) => void;
  isDialogOpen: boolean;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  isDeleteDialogOpen: boolean;
}

const KanbanContext = createContext<KanbanContextType | null>(null);

const STORAGE_KEY = "kanban-board-data";

const initialData: Column[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: "1", title: "Create initial project plan" },
      { id: "2", title: "Design landing page" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      { id: "3", title: "Implement authentication" },
      { id: "4", title: "Fix navbar bugs" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "5", title: "Write API documentation" }],
  },
];

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // 🔹 Load from localStorage first
  const [columns, setColumns] = useState<Column[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState<{
  columnId: ColumnType;
  cardId: string;
} | null>(null);


  const addCard = (columnId: ColumnType) => {
    setActiveColumn(columnId);
    setIsDialogOpen(true);
  };

  const confirmAddCard = () => {
    if (!newTitle.trim() || !activeColumn) return;

    setColumns(cols =>
      cols.map(col =>
        col.id === activeColumn
          ? {
              ...col,
              cards: [
                ...col.cards,
                { id: Date.now().toString(), title: newTitle },
              ],
            }
          : col
      )
    );

    setNewTitle("");
    setActiveColumn(null);
    setIsDialogOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewTitle("");
    setActiveColumn(null);
  };
const deleteCard = (columnId: ColumnType, cardId: string) => {
  setDeleteTarget({ columnId, cardId });
  setIsDeleteDialogOpen(true);
};

const confirmDeleteCard = () => {
  if (!deleteTarget) return;

  const { columnId, cardId } = deleteTarget;

  setColumns(cols =>
    cols.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
        : col
    )
  );

  setDeleteTarget(null);
  setIsDeleteDialogOpen(false);
};

const closeDeleteDialog = () => {
  setDeleteTarget(null);
  setIsDeleteDialogOpen(false);
};


  const updateCard = (columnId: ColumnType, cardId: string, title: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map(c =>
                c.id === cardId ? { ...c, title } : c
              ),
            }
          : col
      )
    );
  };

const moveCard = (
  from: ColumnType,
  to: ColumnType,
  cardId: string,
  overId?: string
) => {
  setColumns(cols => {
    const sourceCol = cols.find(c => c.id === from);
    const targetCol = cols.find(c => c.id === to);
    if (!sourceCol || !targetCol) return cols;

    const card = sourceCol.cards.find(c => c.id === cardId);
    if (!card) return cols;

    // SAME COLUMN → reorder
    if (from === to) {
      const oldIndex = sourceCol.cards.findIndex(c => c.id === cardId);
      const newIndex = overId
        ? sourceCol.cards.findIndex(c => c.id === overId)
        : sourceCol.cards.length - 1;

      const newCards = [...sourceCol.cards];
      newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, card);

      return cols.map(col =>
        col.id === from ? { ...col, cards: newCards } : col
      );
    }

    // DIFFERENT COLUMN → move
    return cols.map(col => {
      if (col.id === from) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      }
      if (col.id === to) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    });
  });
};


  return (
    <KanbanContext.Provider
      value={{ 
      columns,
    addCard,
    confirmAddCard,
    deleteCard,
    confirmDeleteCard,
    closeDialog,
    closeDeleteDialog,
    updateCard,
    moveCard,
    isDialogOpen,
    newTitle,
    setNewTitle,
    isDeleteDialogOpen,  
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used inside KanbanProvider");
  return ctx;
};
