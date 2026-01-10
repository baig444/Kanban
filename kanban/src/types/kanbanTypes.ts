export type ColumnType = "todo" | "in-progress" | "done";

export type Card = {
  id: string;
  title: string;
};

export type Column = {
  id: ColumnType;
  title: string;
  cards: Card[];
};
