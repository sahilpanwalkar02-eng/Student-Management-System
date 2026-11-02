import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot";
import useStudents from "./hooks/useStudents";

/**
 * App — root component with sidebar layout and page routing.
 */
function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const { students } = useStudents();

  return (
    <div className="flex min-h-screen bg-mesh">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        studentCount={students.length}
      />

      {/* Main content — offset by sidebar width */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: "56px" }}
        id="main-content"
      >
        <Dashboard activePage={activePage} />
      </main>

      {/* Floating AI chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
