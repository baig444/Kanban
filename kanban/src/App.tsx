import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { KanbanProvider } from "./context/KanbanContext";

function App() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}

export default App;
