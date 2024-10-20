import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Header from "./Header";
import Find from "./Find";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<Find />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
