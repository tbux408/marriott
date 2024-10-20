import Home from "./Home";
import Find from "./Find";
import Header from "./Header";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
