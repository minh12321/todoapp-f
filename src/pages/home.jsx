import React from "react";
import "./home.css";  
import { useDarkMode } from "../context/DarkModeContext";
import Moon from "../assets/icon-moon.svg";
import Sun from "../assets/icon-sun.svg";
import { Link } from "react-router-dom";

export default function Home() {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <div>
    <div className="home-container">
      <img src={darkMode === true ? Moon : Sun }  className="iconv" alt="toggle-mode" onClick={() => setDarkMode(!darkMode)} />
      <h1 className="home-title">Todo List App</h1>
      <p className="home-subtitle">Quản lý công việc dễ dàng mọi lúc mọi nơi</p>
      <Link className="home-button" to="/login">Bắt đầu</Link>
    </div></div>
  );
}
