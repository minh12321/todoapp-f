import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import Home from "./pages/home";

function App() {
  return (
    <DarkModeProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/tasks" element={<Tasks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/stats" element={<Stats />} /> */}
        </Routes>
      </Router>
    </DarkModeProvider>   
  );
}

export default App;
