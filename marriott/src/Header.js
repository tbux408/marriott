import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/about");
  };

  return (
    <div className="container">
      <div className="box">
        <img
          src="/marriott-logo-black-and-white.png"
          alt="marriot logo"
          width="100px"
          onClick={() => navigate("/")}
          className="logo"
        />
        <h2>Hotel Scouter</h2>
        <div></div>
      </div>
    </div>
  );
}

export default Header;
